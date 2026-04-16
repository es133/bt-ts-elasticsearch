'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {ES_QUERY_PARAM} from "../type/BtEsEnums";
import { RoutingValue, PreferenceValue } from '../type/EsRequestTypes';

export class BtEsAbstractMGetRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.param[ES_QUERY_PARAM.BODY] = {};
    }

    public setIds(docIds:Array<number|string>):void {
        if (docIds !== undefined && docIds !== null) {
            this.param[ES_QUERY_PARAM.BODY]['ids'] = docIds;
        }
    }

    public setDocs(docs:Array<{_id: string | number; _index?: string; _source?: string[]}>):void {
        if (docs !== undefined && docs !== null) {
            this.param[ES_QUERY_PARAM.BODY]['docs'] = docs;
        }
    }

    public setRealtime(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.param['realtime'] = value;
        }
    }

    public setPreference(preference:PreferenceValue):void {
        if (preference !== undefined && preference !== null) {
            this.param['preference'] = preference;
        }
    }

    public setRouting(routing:RoutingValue):void {
        if (routing !== undefined && routing !== null) {
            this.param['routing'] = routing;
        }
    }

    public setRefresh(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.param['refresh'] = value;
        }
    }

    public set ids(docIdList:Array< number|string>) {
        this.setIds(docIdList);
    }

    public set docs(docs:Array<{_id: string | number; _index?: string; _source?: string[]}>) {
        this.setDocs(docs);
    }

    public set realtime(value:boolean) {
        this.setRealtime(value);
    }

    public set preference(preference:PreferenceValue) {
        this.setPreference(preference);
    }

    public set routing(routing:RoutingValue) {
        this.setRouting(routing);
    }

    public set refresh(value:boolean) {
        this.setRefresh(value);
    }

}
