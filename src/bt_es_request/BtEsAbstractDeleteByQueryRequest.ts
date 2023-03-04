'use strict';

import { BtEsAbstractUpdateByQueryRequest } from './BtEsAbstractUpdateByQueryRequest'

export class BtEsAbstractDeleteByQueryRequest extends BtEsAbstractUpdateByQueryRequest {
    constructor() {
        super();
        this.requestParam['body'] = null;
    }
}


