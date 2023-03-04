'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsMatchPhrasePrefixQuery extends EsAbstractQueryDsl {
    protected fieldName:string;
    constructor(field:string, text?:string) {
        super('match_phrase_prefix');
        this.fieldName = field;
        if (text) {
            this.setFieldProperty(field, 'query', text);
        }
    }

    public query(text:string): EsMatchPhrasePrefixQuery {
        this.setFieldProperty(this.fieldName, 'query', text);
        return this;
    }

    public boost(value:number):EsMatchPhrasePrefixQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }

    public slop(value:number):EsMatchPhrasePrefixQuery {
        this.setFieldProperty(this.fieldName, 'slop', value);
        return this;
    }
    public maxExpansions(value:number):EsMatchPhrasePrefixQuery {

        this.setFieldProperty(this.fieldName, 'max_expansions', value);
        return this;
    }
    public zeroTermsQuery(value:string):EsMatchPhrasePrefixQuery {
        this.setFieldProperty(this.fieldName, 'zero_terms_query', value);
        return this;
    }

    public analyzer(analyzer:any):EsMatchPhrasePrefixQuery {
        this.setFieldProperty(this.fieldName, 'analyzer', analyzer);
        return this;
    }

}
