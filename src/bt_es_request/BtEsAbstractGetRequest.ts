'use strict';

import { BtEsAbstractRequest} from './BtEsAbstractRequest'
import { RoutingValue, PreferenceValue } from '../type/EsRequestTypes'

export class BtEsAbstractGetRequest extends BtEsAbstractRequest {
    constructor() {
        super();
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

    public setRealtime(value:boolean):void {
        if (value !== undefined && value !== null) {
            this.param['realtime'] = value;
        }
    }

    public setPreference (preference:PreferenceValue):void {
        if (preference !== undefined && preference !== null) {
            this.param['preference'] = preference;
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

    public set realtime(value:boolean) {
        this.setRealtime(value);
    }

    public set preference (preference:PreferenceValue) {
        this.setPreference(preference);
    }

}
