#!/usr/bin/env node

import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
import {config} from "./es-config";
import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
import {BtEsAbstractPutRequest} from "../src/bt_es_request/BtEsAbstractPutRequest";
import {BtEsBulkIndexResponse} from "../src/response/BtEsBulkIndexResponse";

const docs = [];

//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let esAbstractDao = new BtEsAbstractDao(esConfig);

//Build Query
let putRequest = new BtEsAbstractPutRequest();
putRequest.setIndex(esConfig.getIndexName('article_index'));

esAbstractDao.requestPutBulk(putRequest, docs).then(result => {
    console.log('RESULT:', result);
    process.exit(0);
}).catch(exception => {
    console.error('ERROR:', exception);
});

