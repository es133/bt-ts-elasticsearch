'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsTermsQuery extends EsAbstractQueryDsl {
    protected fieldName:string;
    constructor(field: string, terms?: Array<string|number>) {
        super('terms');
        this.fieldName = field;
        if (terms) {
            this.setFieldProperty(this.fieldName, 'terms', terms);
        }
    }

    public boost(value:number):EsTermsQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }
}
