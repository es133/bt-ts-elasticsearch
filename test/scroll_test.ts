#!/usr/bin/env node

"use strict";
import {EsQueryBuilder, BtEsAbstractSearchRequest} from "../src/BtElasticSearch";
import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';


//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let tbArticleSearchDao = new BtEsAbstractDao(esConfig);

//Build Query
let scrollRequest = new BtEsAbstractSearchRequest();
let queryDsl = EsQueryBuilder.matchAllQuery();
scrollRequest.setQueryDsl(queryDsl);
scrollRequest.setIndex(esConfig.getIndexName('article_index'));
scrollRequest.setScroll('10s');


tbArticleSearchDao.requestSearch(scrollRequest).then(result => {
    console.log('RESULT:', result);


    process.exit(0);
});

