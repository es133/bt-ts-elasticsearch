#!/usr/bin/env node
"use strict";

import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';

//Init dao
const esConfig = new BtEsAbstractConfig(config['esClientService']);
console.log('ES CONFIG:', esConfig);
let tbEsAbstractDao = new BtEsAbstractDao(esConfig);

const mapping = {
    "settings": {
        "index": {
            "number_of_shards": "2",
            "number_of_replicas": "0"
        }
    },
    "mappings": {
        "dynamic": false,
        "properties": {
            "id": { "type": "integer" },
            "type": { "type": "keyword" },
            "member_id": { "type": "integer" },
            "member_nickname": { "type": "keyword" },
            "member_company_id": { "type": "integer" },
            "title": { "type": "text", "index": false },
            "content": { "type": "text", "index": false }
        }
    }
}


//Build Query
tbEsAbstractDao.createIndex('test', mapping).then(result => {
    console.log('RESULT:', result);
    process.exit(0);
}).catch(error => {
    console.error('ERROR:', error);
    process.exit(0);
});
