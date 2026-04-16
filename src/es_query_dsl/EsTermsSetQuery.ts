'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsTermsSetQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string, terms: any[]) {
        super('terms_set');
        this.fieldName = field;
        this.setFieldProperty(this.fieldName, 'terms', terms);
    }

    public terms(terms: any[]): EsTermsSetQuery {
        this.setFieldProperty(this.fieldName, 'terms', terms);
        return this;
    }

    public minimumShouldMatchField(field: string): EsTermsSetQuery {
        this.setFieldProperty(this.fieldName, 'minimum_should_match_field', field);
        return this;
    }

    public minimumShouldMatchScript(script: any): EsTermsSetQuery {
        this.setFieldProperty(this.fieldName, 'minimum_should_match_script', script);
        return this;
    }

    public boost(value: number): EsTermsSetQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }
}
