'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest';

export class BtEsAbstractUpdateRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.requestParam['body'] = null;

    }

    public setTimeout(duration:string):void {
        this.requestParam['timeout'] = duration;
    }

    public setRetryOnConflict(value:number):void {
        this.requestParam['retry_on_conflict'] = value;
    }

    public setId(docId: number|string):void {
        this.requestParam['id'] = docId;
    }

    public setParentId(parentId:number|string):void {
        this.requestParam['parent'] = parentId;
    }

    public setRouting (routing:string):void {
        this.requestParam['routing'] = routing;
    }

    public setScript(script:any, lang:string) {
        if (this.requestParam['body'] === null) {
            this.requestParam['body'] = {};
        }
        if (script !== undefined && script !== null) {
            this.requestParam['body']['script'] = script;
        }
        if (lang !== undefined && lang !== null) {
            this.requestParam['body']['script']['lang'] = lang ;
        }
        if (this.requestParam['body']['doc']) {
            delete this.requestParam['body']['doc'];
        }
    }

    public setDocument(document:any) {
        if (this.requestParam['body'] === null) {
            this.requestParam['body'] = {};
        }
        this.requestParam['body']['doc'] = document;
        if (this.requestParam['body']['script']) {
            delete this.requestParam['body']['script'];
        }
    }

}
