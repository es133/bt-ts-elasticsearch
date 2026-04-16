'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import { RoutingValue, ScriptDefinition } from '../type/EsRequestTypes';

export class BtEsAbstractUpdateRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.param['body'] = null;

    }

    public setTimeout(duration:string):void {
        this.param['timeout'] = duration;
    }

    public setRetryOnConflict(value:number):void {
        this.param['retry_on_conflict'] = value;
    }

    public setId(docId: number|string):void {
        this.param['id'] = docId;
    }

    public setParentId(parentId:number|string):void {
        this.param['parent'] = parentId;
    }

    public setRouting (routing:RoutingValue):void {
        this.param['routing'] = routing;
    }

    public set timeout(duration:string) {
        this.setTimeout(duration);
    }

    public set retry(value:number) {
        this.setRetryOnConflict(value);
    }

    public set id(docId:number|string) {
        this.setId(docId);
    }

    public set parentId(parentId:number|string) {
        this.setParentId(parentId);
    }

    public set routing (routing:RoutingValue) {
        this.setRouting(routing);
    }

    public setScript(script:ScriptDefinition | string, lang?:string) {
        if (this.param['body'] === null) {
            this.param['body'] = {};
        }
        if (script !== undefined && script !== null) {
            this.param['body']['script'] = script;
        }
        if (lang !== undefined && lang !== null) {
            this.param['body']['script']['lang'] = lang ;
        }
        if (this.param['body']['doc']) {
            delete this.param['body']['doc'];
        }
    }

    public setDocument(document:Record<string, any>) {
        if (this.param['body'] === null) {
            this.param['body'] = {};
        }
        this.param['body']['doc'] = document;
        if (this.param['body']['script']) {
            delete this.param['body']['script'];
        }
    }

}
