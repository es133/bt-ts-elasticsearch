import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
import {config} from "./es-config";
import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
import {BtEsAbstractSearchRequest} from "../src/bt_es_request/BtEsAbstractSearchRequest";
import {EsQueryBuilder} from "../src/es_query_dsl/EsQueryBuilder";
import {BtEsSearchResponse} from "../src/response/BtEsSearchResponse";

describe('TEST ES SCROLL API', ()=> {

//Init dao
    const esConfig = new BtEsAbstractConfig(config['esClientService']);
    console.log('ES CONFIG:', esConfig);
    let tbArticleSearchDao = new BtEsAbstractDao(esConfig);

    it('Test SCROLL API', async ()=> {
        //Build Query
        let scrollRequest = new BtEsAbstractSearchRequest();
        let queryDsl = EsQueryBuilder.matchAllQuery();
        scrollRequest.setQueryDsl(queryDsl);
        scrollRequest.setIndex(esConfig.getIndexName('article_index'));
        scrollRequest.setScroll('10s');
        scrollRequest.setSize(100);

        let response = <BtEsSearchResponse>await tbArticleSearchDao.requestSearch(scrollRequest);
        let scrollId = response.scrollId;
        if (!scrollId) {
            throw new Error('NO scrollID');
        }

        console.log('SCROLL API RESPONSE:', response);

        do {

            response = <BtEsSearchResponse> await tbArticleSearchDao.requestScroll(scrollId, '10s');
            console.log('KEEP SCROLLING:', response);
            console.log('FETCH SIZE:', response.hits.length);
        } while (response.hits.length === 100);

        response = await tbArticleSearchDao.deleteScroll(scrollId);
        console.log('CLOSE SCROLL: ', response);


    });
});