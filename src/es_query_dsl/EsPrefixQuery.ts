'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsPrefixQuery extends EsAbstractQueryDsl{

    protected fieldName: string;

    constructor(field: string, value?: any, boost?: number) {
        super('prefix');
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

    public value(value:any):EsPrefixQuery {
        this.setFieldProperty(this.fieldName, 'value', value);
        return this;
    }

    public boost(boost:any):EsPrefixQuery {
        this.setFieldProperty(this.fieldName, 'boost', boost);
        return this;
    }
}
