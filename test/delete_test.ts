#!/usr/bin/env node

import {config} from './es-config';
import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
import {BtEsAbstractDeleteRequest, BtEsDocumentIndexResponse} from "../src/BtElasticSearch";

const doc = {
    "id": 6099
}

//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let esAbstractDao = new BtEsAbstractDao(esConfig);

//Build Query
let deleteRequest = new BtEsAbstractDeleteRequest();
deleteRequest.setIndex(esConfig.getIndexName('search_index'));
deleteRequest.setId(6099);

esAbstractDao.requestDelete(deleteRequest).then(result => {
    console.log('RESULT:', result);
    process.exit(0);
}).catch(exception => {
    console.error('ERROR:', exception);
});


/*
tbArticleSearchDao.searchArticle(tbArticleSearchQuery, function(err, response, status) {

    console.log('Response: ', JSON.stringify(response));
});
*/
