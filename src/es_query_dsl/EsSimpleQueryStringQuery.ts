'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_QUERY_LOGIC_OPERATOR} from "../type/BtEsEnums";

export class EsSimpleQueryStringQuery extends EsAbstractQueryDsl {
    constructor(fields?:Array<string>, query?:string ) {
        super('simple_query_string');
        if (fields) {
            this.setProperty('fields', fields);
        }
        if (query) {
            this.setProperty('query', query);
        }

    }

    public boost(value:number):EsSimpleQueryStringQuery {
        this.setProperty('boost', value);
        return this;
    }

    public query(query: string) {
        this.setProperty('query', query);
        return this;
    }

    public fields(fields:Array<string>):EsSimpleQueryStringQuery {
        this.setProperty('fields', fields);
        return this;
    }

    public defaultOperator(operator:BT_ES_QUERY_LOGIC_OPERATOR): EsSimpleQueryStringQuery {
        this.setProperty('default_operator', operator);
        return this;
    }

    public analyzer(analyzer:any): EsSimpleQueryStringQuery {
        this.setProperty('analyzer', analyzer);
        return this;
    }

    public fuzzyMaxExpansions(value:number): EsSimpleQueryStringQuery {
        this.setProperty('fuzzy_max_expansions', value);
        return this;
    }

    public fuzzyTranspositions(value:boolean): EsSimpleQueryStringQuery {
        this.setProperty('fuzzy_transpositions', value);
        return this;
    }

    public fuzzyPrefixLength(value:number): EsSimpleQueryStringQuery {
        this.setProperty('fuzzy_prefix_length', value);
        return this;
    }

    public minimumShouldMatching(value:number): EsSimpleQueryStringQuery{
        this.setProperty('minium_should_matching',value);
        return this;
    }

    public lenient(value:boolean): EsSimpleQueryStringQuery {
        this.setProperty('lenient',value);
        return this;
    }

    public quoteFieldSuffix(pattern: string): EsSimpleQueryStringQuery {
        this.setProperty('quote_field_suffix', pattern);
        return this;
    }

}
