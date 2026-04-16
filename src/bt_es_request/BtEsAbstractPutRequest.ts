'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {ES_INDEX_OP_TYPE} from "../type/BtEsEnums";

export class BtEsAbstractPutRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.param['body'] = null;
        this.param['op_type'] = 'index';
    }

    public setTimestamp(timestamp:Date):void {
        if (timestamp !== undefined && timestamp !== null) {
            this.param['@timestamp'] = timestamp;
        }
    }

    public setId(docId:number|string):void {
        this.param['id'] = docId;
    }

    public setParentId(parentId:number|string):void {
        this.param['parent'] = parentId;
    }

    public setRouting (routing:string):void {
        this.param['routing'] = routing;
    }

    public setOpType (opType:ES_INDEX_OP_TYPE):void {
        this.param['op_type'] = opType;
    }

    public getOpType():ES_INDEX_OP_TYPE {
        return this.param['op_type'];
    }

    public getRouting(): string {
        return this.param['routing'];
    }

    public set timestamp(timestamp:Date) {
        this.setTimestamp(timestamp);
    }

    public set id(docId:number|string) {
        this.setId(docId);
    }

    public set parentId(parentId:number|string) {
        this.setParentId(parentId);
    }

    public set opType (opType:ES_INDEX_OP_TYPE) {
        this.setOpType(opType);
    }

    public get opType():ES_INDEX_OP_TYPE {
        return this.getOpType();
    }

    public get routing(): string {
        return this.getRouting();
    }
}
