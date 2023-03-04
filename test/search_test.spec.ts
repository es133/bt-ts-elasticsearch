import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
import {config} from "./es-config";
import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
import {BtEsAbstractSearchRequest} from "../src/bt_es_request/BtEsAbstractSearchRequest";
import {EsQueryBuilder} from "../src/es_query_dsl/EsQueryBuilder";
import {BtEsSearchResponse} from "../src/response/BtEsSearchResponse";

describe('TEST ES SEARCH API', ()=> {

    //Init dao
    const esConfig = new BtEsAbstractConfig(config['esClientService']);
    console.log('ES CONFIG:', esConfig);
    const tbArticleSearchDao = new BtEsAbstractDao(esConfig);

    it('SEARCH API', async ()=> {
        //Build Query
        let request = new BtEsAbstractSearchRequest();
        let queryDsl = EsQueryBuilder.matchAllQuery();
        request.setQueryDsl(queryDsl);
        request.setIndex(esConfig.getIndexName('article_index'));
        request.source = true;

        let response = <BtEsSearchResponse>await tbArticleSearchDao.requestSearch(request);
        console.log('Search API RESPONSE:', JSON.stringify(response, null, 2));
    });
});