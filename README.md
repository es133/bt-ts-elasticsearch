# bt-ts-elasticsearch

- By bugshot
- A typescript supporting library for elasticsearch nodejs client
- Supporting Elasticsearch 7.17 (2022.06)

1. Installation
   1. ```
      npm install "git+https://"
      ```
      inside 'dependencies' section in package.json file


2. Quick example
   1. Configuration
      ```
      const config  = { 
                          esClientService: { 
                              configuration: { 
                                  nodes: [ 'http://node-url:9200' ], 
                                  maxRetries: 3, 
                                  requestTimeout: 30000, 
                              }, 
                              index: {
                                 article_index: 'article',
                                 search_index: 'search-test',
                              }, 
                          } 
                       }; 
      ```
   2. Get document
      ```typescript
         //REQUEST
         import { BtEsAbstractGetRequest, } from "../src/BtElasticSearch"; 
         import {BtEsAbstractDao} from "../src/BtElasticSearch"; 
         import { BtEsAbstractConfig } from "../src/BtElasticSearch"; 
         
         //Init dao 
         const esConfig = new BtEsAbstractConfig(config['esClientService']); 
         let tbArticleSearchDao = new BtEsAbstractDao(esConfig);

         //Build Query
         let searchRequest = new BtEsAbstractGetRequest();
         searchRequest.setIndex(esConfig.getIndexName('search_index'));
         searchRequest.setId(3954);
         searchRequest.setSource(true);

         tbArticleSearchDao.requestGet(searchRequest).then(result => {
            console.log('RESULT:', result);
            process.exit(0);
         }).catch(error => {
            console.error('ERROR:', error);
            process.exit(0);
         });
      ```
      ```typescript
         //RESPONSE
         BtEsGetResponse {
            statusCode: 200,
            response: {
               index: 'search',
               id: '3954',
               version: 1,
               sequenceNumber: 1541,
               primaryTerm: 1,
               found: true,
               source: {
                  id: 3954,
                  member_company_id: 69,
                  member_company_name: 'COMPANY',
                  ...
                  is_auth: 'Y',
                  hashtags: [],
                  distance: 0
               }
            }
         }
      ``` 
   3. Search document
      ```typescript 
         import {EsQueryBuilder, BtEsAbstractSearchRequest} from "../src/BtElasticSearch";
         import {BtEsAbstractDao} from "../src/BtElasticSearch";
         import { BtEsAbstractConfig } from "../src/BtElasticSearch";

         const keyword = 'hire';

         //Init dao
         const esConfig = new BtEsAbstractConfig(config['esClientService']);
         console.log('ES CONFIG:', esConfig);
         let tbArticleSearchDao = new BtEsAbstractDao(esConfig);

         //Build Query
         let searchRequest = new BtEsAbstractSearchRequest();
         let queryDsl = EsQueryBuilder.boolQuery().must(EsQueryBuilder.matchQuery('content', keyword));
         searchRequest.setQueryDsl(queryDsl);
         searchRequest.setIndex(esConfig.getIndexName('search_index'));
         searchRequest.setSource(true);


         tbArticleSearchDao.requestSearch(searchRequest).then(result => {
            console.log('RESULT:', result);
            process.exit(0);
         }).catch(error => {
            console.error('ERROR:', error);
            process.exit(0);
         });
      ```
      ```typescript
         //RESPONSE
         BtEsSearchResponse {
            statusCode: 200,
            took: 0,
            totalCount: 13070,
            maxScore: 1,
            hits: [
               {
               _index: 'article',
               _type: '_doc',
               _id: '1257',
               _score: 1,
               _source: [Object]
               },
               {
               _index: 'article',
               _type: '_doc',
               _id: '1259',
               _score: 1,
               _source: [Object]
               },
               {
               _index: 'article',
               _type: '_doc',
               _id: '1268',
               _score: 1,
               _source: [Object]
               },
                ...
      ```
   4. Index document
      ```typescript
         import {config} from './es-config';
         import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
         import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
         import {BtEsAbstractPutRequest} from "../src/tb_es_request/BtEsAbstractPutRequest";
         import {BtEsDocumentIndexResponse} from "../src/BtElasticSearch";

         const doc = {
            "id": 111111,
            "title": 'TITLE',
            "content": 'CONTENT',
         }

         //Init dao
         const esConfig = new BtEsAbstractConfig(config['esClientService']);
         console.log('ES CONFIG:', esConfig);
         let esAbstractDao = new BtEsAbstractDao(esConfig);

         //Build Query
         let putRequest = new BtEsAbstractPutRequest();
         putRequest.setIndex(esConfig.getIndexName('search_index'));

         esAbstractDao.requestPut(putRequest, doc).then(result => {
            console.log('RESULT:', result);
            process.exit(0);
         }).catch(exception => {
            console.error('ERROR:', exception);
         });

      ```
      ```typescript 
         //RESPONSE
          BtEsDocumentIndexResponse {
               statusCode: 200,
               response: {
                  id: '6099',
                  index: 'search-test',
                  version: 3,
                  result: 'updated',
                  sequenceNumber: 13711,
                  primaryTerm: 2,
                  shardInfo: { total: 1, success: 1, fail: 0 }
               }
          } 
      ```
3. Connection configuration
   1. You should implement BtEsConfig interface; only returning ClientOptions which declared in @elastic/elasticsearch library
   2. Most in cases you can use BtEsAbstractConfig class, if you need some specific configuration then extends this class or implements you own class.

4. How to create ES query DSL
   1. QueryDSL (Domain specific language) is JSON based query for Elasticsearch.
   2. Due to JSON format, it's little uncomfortable to using inside code;so many bracket/braces, indentations... 
   3. So avoiding this agony, I make it easier to use.
   4. Almost all types of ES query dsl is declared. You can easily use this via EsQueryBuilder class.
   5. Here's some example
      ```typescript
      //Term query
      const termQuery = EsQueryBuilder.termQuery('title');
      termQuery.value('blind');
      termQuery.boost(5);
      
      //Distance feature query
      const boolQuery = EsQueryBuilder.boolQuery();
      boolQuery.must(EsQueryBuilder.termQuery('field', 'value'));
      boolQuery.should(EsQueryBuilder.distanceFeatureQuery('created_at', 'now', '5d'));
      ```
   
5. Add search options
   1. Using aggregations
      1. Aggregation is very powerful feature for metric, statistics(I owed when developing pulse, TC feature) 
      2. It's similar to query dsl, here's some example
      ```typescript
        //STAT aggregation
        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        const statAggs = EsAggregationBuilder.statsAggregations('survey_stat_aggs');
        statAggs.field('score');

        request.addAggregations(statAggs);
      ```
      ```typescript
        //Date histogram agggregation
        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        const aggs = EsAggregationBuilder.dateHistogramAggregations('date_histogram_aggs', 'response_date');
        aggs.interval('day', 'yyyy-MM-dd');
        aggs.extendedBounds(-60, 0);

        request.addAggregations(aggs);
      ```
   2. Using sort
      1. Offering 3types of sorting; generic, nested, script
      2. ex
      ```typescript
        //Tophit aggregation with script sort
        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        const idList = [1,2,3];
        boolQuery.must(EsQueryBuilder.pinnedQuery(idList, matchQuery));
        request.setQueryDsl(boolQuery);

        const channelAggs = EsAggregationBuilder.termsAggregations('channel_aggs', 'company_id');
        const topHitsAggs = EsAggregationBuilder.topHitsAggregations('sample_top_hits_aggs');
        topHitsAggs.size(1);
        
        const tophitSort = EsSearchOptionBuilder.scriptSort(
            {
                _script: {
                    type: `number`,
                    script: {
                        source: `doc['comment_cnt'].value * 2 + doc['like_cnt'].value - doc['report_cnt'].value * 4`
                    },
                    order: `desc`
                }
            }
        );
        topHitsAggs.addSort(tophitSort);
        channelAggs.subAggregations(topHitsAggs);
        request.addAggregations(channelAggs);
      ```
   3. Using suggest; Not fully tested yet
6. Send request
   1. Using this library consisted these steps
      1. Create DAO using configuration
      ```typescript
      const esConfig = new BtEsAbstractConfig(config['esClientService']);
      let tbArticleSearchDao = new BtEsAbstractDao(esConfig);
      ```
      2. Select proper request;For search document, index document, delete document, etc
      ```typescript
      let searchRequest = new BtEsAbstractSearchRequest();
      ```
      3. Build Query DSL
      ```typescript
      const queryDsl = EsQueryBuilder.boolQuery().must(EsQueryBuilder.matchQuery('content', keyword));
      searchRequest.setQueryDsl(queryDsl);
      searchRequest.setIndex(esConfig.getIndexName('search_index'));
      searchRequest.setSource(true);
      ```
      4. If needed, add aggregation and sorting
      ```typescript
      const channelAggs = EsAggregationBuilder.termsAggregations('channel_aggs', 'company_id');
      const topHitsAggs = EsAggregationBuilder.topHitsAggregations('sample_top_hits_aggs');
      topHitsAggs.size(1);
        
      const tophitSort = EsSearchOptionBuilder.scriptSort(
      {
             _script: {
                 type: `number`,
                 script: {
                     source: `doc['read_count'].value * 2`
                 },
                 order: `desc`
             }
         }
      );
      topHitsAggs.addSort(tophitSort);
      channelAggs.subAggregations(topHitsAggs);
      request.addAggregations(channelAggs);
      ```
      5. Send request and receive response from ES 
      ```typescript
      let response = <BtEsSearchResponse>await tbArticleSearchDao.requestSearch(request);
      ```
      6. Easy, right?
      
7. Receive response
   1. You can get response using pre defined some response classes in src/response directory
   2. Also, can make your own response class implementing BtEsResponse interface