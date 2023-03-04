'use strict';

import { BtEsAbstractRequest} from './BtEsAbstractRequest'

export class BtEsAbstractGetRequest extends BtEsAbstractRequest {
    constructor() {
        super();
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

    public setRealtime(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.requestParam['realtime'] = value;
        }
    }

    public setPreference (preference:any):void {
        if (preference !== undefined && preference !== null) {
            this.requestParam['preference'] = preference;
        }
    }

}
