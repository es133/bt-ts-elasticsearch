'use strict';

import { Client } from "@elastic/elasticsearch";
import { BtEsConfig } from './interface/BtEsConfig';

export class BtEsAbstractDao {

    protected esClient: Client;

    constructor(config: BtEsConfig) {
        this.esClient = new Client(config.buildConnectionConfig());
    }
}
