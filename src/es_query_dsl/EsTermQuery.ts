'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';
import {EsQueryDsl} from "../interface/EsQueryDsl";
import {EsTermsQuery} from "./EsTermsQuery";

export class EsTermQuery extends EsAbstractQueryDsl {
    //protected body: {[fieldName:string]: Map<string,EsValue>};
    //protected dslBody: {[fieldName:string]: EsValue};
    protected fieldName: string;

    constructor(field:string, value?:any, boost?: number) {
        super('term');
        this.fieldName = field;

        if (value) {
            //this.dslBody[this.fieldNameName].set('value', value);
            //const valueObj = { value:value };
            this.setFieldProperty(this.fieldName, 'value', value);
        }

        if (boost) {
            //this.dslBody[this.fieldNameName].set('boost', boost);
            this.setFieldProperty(this.fieldName, 'boost', boost);
        }
    }

    public value(value:any):EsTermQuery{
        this.setFieldProperty(this.fieldName, 'value', value);
        return this;
    }

    public boost(boost:any):EsTermQuery{
        this.setFieldProperty(this.fieldName, 'boost', boost);
        return this;
    }

}
