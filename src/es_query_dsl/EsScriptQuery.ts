'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsScriptQuery extends EsAbstractQueryDsl {

    constructor(source?:string, params?:any) {
        super('script');
        this.setFieldProperty('script', 'lang', 'painless');
        if(source) {
            this.setFieldProperty('script', 'source', source);
        }
        if (params) {
            this.setFieldProperty('script', 'params', params);
        }
    }


    public source(source:string): EsScriptQuery {
        this.setFieldProperty('script', 'source', source);
        return this;
    }

    public params(params:any): EsScriptQuery {
        this.setFieldProperty('script', 'params', params);
        return this;
    }
}
