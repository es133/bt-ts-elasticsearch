'use strict';

import { BtEsAbstractRequest } from './BtEsAbstractRequest'
import { RoutingValue } from '../type/EsRequestTypes'

export class BtEsAbstractDeleteRequest extends BtEsAbstractRequest {
    constructor(docId?:number|string) {
        super();
        if (docId) {
            this.param['id'] = docId;
        }
    }

    public setId(docId:number|string):void {
        if (docId !== undefined && docId !== null) {
            this.param['id'] = docId;
        }
    }

    public setParentId(parentId:number|string):void {
        if (parentId !== undefined && parentId!== null) {
            this.param['parent'] = parentId;
        }
    }

    public setRouting (routing:RoutingValue):void {
        if (routing !== undefined && routing !== null) {
            this.param['routing'] = routing;
        }
    }
    public set id(docId:string|number) {
        this.setId(docId);
    }

    public set parentId(parentId:string|number) {
        this.setParentId(parentId);
    }

    public set routing (routing:RoutingValue) {
        this.setRouting(routing);
    }
}
