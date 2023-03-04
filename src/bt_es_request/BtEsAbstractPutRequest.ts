'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {BT_ES_INDEX_OP_TYPE} from "../type/BtEsEnums";

export class BtEsAbstractPutRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.requestParam['body'] = null;
        this.requestParam['opType'] = 'index';
    }

    public setTimestamp(timestamp:Date):void {
        if (timestamp !== undefined && timestamp !== null) {
            this.requestParam['@timestamp'] = timestamp;
        }
    }

    public setId(docId:number|string):void {
        this.requestParam['id'] = docId;
    }

    public setParentId(parentId:number|string):void {
        this.requestParam['parent'] = parentId;
    }

    public setRouting (routing:string):void {
        this.requestParam['routing'] = routing;
    }

    public setOpType (opType:BT_ES_INDEX_OP_TYPE):void {
        this.requestParam['opType'] = opType;
    }

    public getOpType():BT_ES_INDEX_OP_TYPE {
        return this.requestParam['opType'];
    }

    public getRouting(): string {
        return this.requestParam['routing'];
    }
}
