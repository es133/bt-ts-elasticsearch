#!/usr/bin/env node

import {BtEsAbstractConfig} from "../src/BtEsAbstractConfig";
import {config} from "./es-config";
import {BtEsAbstractDao} from "../src/BtEsAbstractDao";
import {BtEsAbstractDeleteRequest} from "../src/bt_es_request/BtEsAbstractDeleteRequest";
import {BtEsBulkIndexResponse} from "../src/response/BtEsBulkIndexResponse";

//const TbElasticSearch = require('TbElasticSearch');

const docIds = ['700252','605019','609939', '608559', '717720'];

//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let esAbstractDao = new BtEsAbstractDao(esConfig);

//Build Query
let deleteRequest = new BtEsAbstractDeleteRequest();
deleteRequest.setIndex(esConfig.getIndexName('article_index'));

esAbstractDao.requestDeleteBulk(deleteRequest, docIds).then(result => {
    console.log('RESULT:', result);
    process.exit(0);
}).catch(exception => {
    console.error('ERROR:', exception);
});
