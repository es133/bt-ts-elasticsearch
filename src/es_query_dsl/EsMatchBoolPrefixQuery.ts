'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsMatchBoolPrefixQuery extends EsAbstractQueryDsl {

    protected fieldName: string;

    constructor(field:string, text?:string) {
        super('match_bool_prefix');
        this.fieldName = field;
        if (text) {
            this.setFieldProperty(this.fieldName, 'query', text);
        }
    }

    public query(text:string): EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'query', text);
        return this;
    }

    public analyzer(analyzer:any):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'analyzer', analyzer);
        return this;
    }

    public fuzziness(value:any):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'fuzziness', value);
        return this;
    }

    public maxExpansions(value:number):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'max_expansions', value);
        return this;
    }

    public prefixLength(value:number):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'prefix_length', value);
        return this;
    }

    public transpositions(value:boolean):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'transpositions', value);
        return this;
    }

    public boost(value:number):EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }

    public minimumShouldMatch(value:number): EsMatchBoolPrefixQuery {
        this.setFieldProperty(this.fieldName, 'minium_should_match', value);
        return this;
    }


}
