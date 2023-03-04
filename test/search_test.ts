#!/usr/bin/env node
"use strict";
import {EsQueryBuilder, BtEsAbstractSearchRequest} from "../src/BtElasticSearch";
import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';

const keyword = 'hire';

//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let tbArticleSearchDao = new BtEsAbstractDao(esConfig);

//Build Query
const searchRequest = new BtEsAbstractSearchRequest();
const queryDsl = EsQueryBuilder.boolQuery().must(EsQueryBuilder.matchQuery('content', keyword));
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


/*
tbArticleSearchDao.searchArticle(tbArticleSearchQuery, function(err, response, status) {

    console.log('Response: ', JSON.stringify(response));
});
*/
