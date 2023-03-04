#!/usr/bin/env node

import { BtEsAbstractGetRequest, } from "../src/BtElasticSearch";
import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';

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
