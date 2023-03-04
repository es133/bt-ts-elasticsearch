'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {BT_ES_QUERY_PARAM} from "../type/BtEsEnums";

export class BtEsAbstractMGetRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.requestParam[BT_ES_QUERY_PARAM.BODY] = {};
    }

    public setIds(docIds:Array<number|string>):void {
        if (docIds !== undefined && docIds !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.BODY]['ids'] = docIds;
        }
    }

    public setDocs(docs:any):void {
        if (docs !== undefined && docs !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.BODY]['docs'] = docs;
        }
    }

    public setRealtime(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.requestParam['realtime'] = value;
        }
    }

    public setPreference(preference:any):void {
        if (preference !== undefined && preference !== null) {
            this.requestParam['preference'] = preference;
        }
    }

    public setRouting(routing:any):void {
        if (routing !== undefined && routing !== null) {
            this.requestParam['routing'] = routing;
        }
    }

    public setRefresh(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.requestParam['refresh'] = value;
        }
    }
}
