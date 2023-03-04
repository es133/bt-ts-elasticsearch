'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsFuzzyQuery extends EsAbstractQueryDsl{

    protected fieldName: string;

    constructor(field:string, value?:string) {
        super('fuzzy');
        this.fieldName = field;

        if (value) {
            this.setFieldProperty(field, 'value', value);
        }
    }

    public value(value:string):EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'value', value);
        return this;
    }

    public fuzziness(value:string): EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'fuzziness', value);
        return this;
    }

    public prefixLength(value:number):EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'prefix_length', value);
        return this;
    }

    public maxExpansions(value:number):EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'max_expansions', value);
        return this;
    }
    public transpositions(value:boolean):EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'transpositions', value);
        return this;
    }

    public rewrite(value:string):EsFuzzyQuery {
        this.setFieldProperty(this.fieldName, 'rewrite', value);
        return this;
    }
}
