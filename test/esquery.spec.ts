import {BtEsAbstractSearchRequest} from "../src/bt_es_request/BtEsAbstractSearchRequest";
import {EsQueryBuilder} from "../src/es_query_dsl/EsQueryBuilder";
import {EsSearchOptionBuilder} from "../src/es_search_option/EsSearchOptionBuilder";
import {EsAggregationBuilder} from "../src/es_search_option/aggs/EsAggregationBuilder";
import {EsQueryStringQuery} from "../src/es_query_dsl/EsQueryStringQuery";
import {EsScriptSort} from "../dist/es_search_option/sort/EsScriptSort";

describe('TEST ES query builder', ()=> {

    it('TERM', ()=> {

        const request = new BtEsAbstractSearchRequest();

        const queryDsl = EsQueryBuilder.boolQuery();
        queryDsl.must(EsQueryBuilder.termQuery('title', 'test', 2));
        queryDsl.must(EsQueryBuilder.wildcardQuery('title_1','test_1',5));
        request.setQueryDsl(queryDsl);
        console.log('TERM QUERY:', JSON.stringify(request.getRequestParam(), null, 2));

    });
    it('DISTANCE_FEATURE', async () => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        boolQuery.must(EsQueryBuilder.termQuery('field', 'value'));
        boolQuery.must(EsQueryBuilder.matchQuery('field', 'text'));
        boolQuery.should(EsQueryBuilder.distanceFeatureQuery('created_at', 'now', '5d'));

        request.setQueryDsl(boolQuery);
        console.log('DISTANCE_FEATURE QUERY:', JSON.stringify(request.getRequestParam(), null, 2));

        return;
    });
    it('HIGHLIGHT', async () => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        boolQuery.must(EsQueryBuilder.termQuery('field', 'value'));
        request.setQueryDsl(boolQuery);

        const highlightOption = EsSearchOptionBuilder.highlight(['title', 'content', 'title_raw']);
        highlightOption.boundaryChars('|', 'title');
        highlightOption.preTags('^');
        highlightOption.postTags('^');

        request.addHighlight(highlightOption);

        console.log('HIGHLIGHT QUERY:', JSON.stringify(request.getRequestParam(), null, 2));

        return;
    });
    it ('PINNED', async() => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        const idList = [1,2,3];
        boolQuery.must(EsQueryBuilder.pinnedQuery(idList, matchQuery));
        request.setQueryDsl(boolQuery);

        const pinnedQuery = EsQueryBuilder.pinnedQuery();
        pinnedQuery.idList([10,11,12]);
        pinnedQuery.organicQuery(EsQueryBuilder.boolQuery().must(EsQueryBuilder.termQuery('keyword', 'kimchy')));
        boolQuery.mustNot(pinnedQuery);

        console.log('PINNED QUERY:', JSON.stringify(request.getRequestParam(), null, 2));
    });

    it ('TOP HITS AGGS', async() => {

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

        console.log('TOP HITS AGGS QUERY:', JSON.stringify(request.getRequestParam(), null, 2));
    });

    it ('STAT AGGS', async() => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        const statAggs = EsAggregationBuilder.statsAggregations('survey_stat_aggs');
        statAggs.field('score');

        request.addAggregations(statAggs);

        console.log('STAT AGGS:', JSON.stringify(request.getRequestParam(), null, 2));

    });

    it ('MOVING FUNCTION AGGS', async() => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        //"moving_score_sum_aggs": {
        //   "moving_fn": {
        //      "buckets_path": "score_sum_aggs",
        //      "window": 30,
        //      "shift": 1,
        //      "script": {
        //         "source": "return MovingFunctions.sum(values)"
        //      }
        //   }
        //}

        const mvScoreSumAggs = EsAggregationBuilder.movingFunctionAggregations('moving_score_sum_aggs', 'score_sum_aggs');
        mvScoreSumAggs.window(30);
        mvScoreSumAggs.shift(1);
        mvScoreSumAggs.script({
            source:'return MovingFunctions.sum(values)'
        })
        request.addAggregations(mvScoreSumAggs);

        console.log('FUNCTION AGGS:', JSON.stringify(request.getRequestParam(), null, 2));

    });

    it ('MOVING Avg AGGS', async() => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        const mvScoreAvgAggs = EsAggregationBuilder.movingFunctionAggregations('moving_score_avg_aggs', 'score_avg_aggs');
        mvScoreAvgAggs.window(30);
        mvScoreAvgAggs.shift(1);
        request.addAggregations(mvScoreAvgAggs);

        console.log('AVG AGGS:', JSON.stringify(request.getRequestParam(), null, 2));

    });

    it ('DATE_HISTOGRAM AGGS', async() => {

        const request = new BtEsAbstractSearchRequest();

        const boolQuery = EsQueryBuilder.boolQuery();
        const matchQuery = EsQueryBuilder.matchQuery('title', 'foo-bar');
        boolQuery.must(matchQuery);
        request.setQueryDsl(boolQuery);

        const aggs = EsAggregationBuilder.dateHistogramAggregations('date_histogram_aggs', 'response_date');
        aggs.interval('day', 'yyyy-MM-dd');
        aggs.extendedBounds(-60, 0);

        request.addAggregations(aggs);

        console.log('DATE HISTOGRAM AGGS:', JSON.stringify(request.getRequestParam(), null, 2));

    });

    it('MATCH PHRASE', ()=> {

        const request = new BtEsAbstractSearchRequest();

        const queryDsl = EsQueryBuilder.boolQuery();
        queryDsl.must(EsQueryBuilder.matchPhraseQuery('title', 'blind').slop(5));
        request.setQueryDsl(queryDsl);
        console.log('MATCH PHRASE QUERY:', JSON.stringify(request.getRequestParam(), null, 2));

    });

});