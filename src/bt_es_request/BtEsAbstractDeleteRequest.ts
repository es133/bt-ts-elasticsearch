'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest'

export class BtEsAbstractDeleteRequest extends BtEsAbstractRequest {
    constructor(docId?:number|string) {
        super();
        if (docId) {
            this.requestParam['id'] = docId;
        }
    }

    public setId(docId:number|string):void {
        if (docId !== undefined && docId !== null) {
            this.requestParam['id'] = docId;
        }
    }

    public setParentId(parentId:number|string):void {
        if (parentId !== undefined && parentId!== null) {
            this.requestParam['parent'] = parentId;
        }
    }

    public setRouting (routing:any):void {
        if (routing !== undefined && routing !== null) {
            this.requestParam['routing'] = routing;
        }
    }
}
