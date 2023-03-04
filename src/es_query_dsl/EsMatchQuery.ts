'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_QUERY_LOGIC_OPERATOR} from "../type/BtEsEnums";

export class EsMatchQuery extends EsAbstractQueryDsl {

    protected fieldName:string;
    constructor(field:string, text?:string) {
        super('match');
        this.fieldName = field;
        if (text) {
            this.setFieldProperty(field, 'query', text);
        }
    }

    public query(query:string): EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'query', query);
        return this;
    }

    public analyzer(analyzer:any):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'analyzer', analyzer);
        return this;
    }

    public fuzziness(value:any):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'fuzziness', value);
        return this;
    }

    public fuzzyTranspositions(value:boolean):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'fuzzy_transpositions', value);
        return this;
    }

    public autoGenerateSynonymsPhraseQuery(value:boolean):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'auto_generate_synonyms_phrase_query', value);
        return this;
    }

    public prefixLength(value:number):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'prefix_length', value);
        return this;
    }

    public boost(value:number):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }

    public maxExpansions(value:number):EsMatchQuery {

        this.setFieldProperty(this.fieldName, 'max_expansions', value);
        return this;
    }

    public zeroTermsQuery(value:string):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'zero_terms_query', value);
        return this;
    }

    public operator(operator:BT_ES_QUERY_LOGIC_OPERATOR):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'operator', operator);
        return this;
    }

    public minimumShouldMatch(value:any):EsMatchQuery {
        this.setFieldProperty(this.fieldName, 'minimum_should_match', value);
        return this;
    }

}
