'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_QUERY_LOGIC_OPERATOR} from "../type/BtEsEnums";

export class EsQueryStringQuery extends EsAbstractQueryDsl {
    constructor(fields?:Array<string>, query?:string) {
        super('query_string');

        if (fields) {
            this.setProperty('fields', fields);
        }

        if (query) {
            this.setProperty('query', query);
        }
    }

    public boost(value:number):EsQueryStringQuery {
        this.setProperty('boost', value);
        return this;
    }


    public query(query:string):EsQueryStringQuery {
        this.setProperty('query', query);
        return this;
    }

    public fields(fields:Array<string>):EsQueryStringQuery {
        this.setProperty('fields', fields);
        return this;
    }

    public defaultField(field:string): EsQueryStringQuery {
        this.setProperty('default_field', field);
        return this;
    }

    public defaultOperator(operator:BT_ES_QUERY_LOGIC_OPERATOR): EsQueryStringQuery {
        this.setProperty('default_operator', operator);
        return this;
    }

    public analyzer(analyzer:any): EsQueryStringQuery {
        this.setProperty('analyzer', analyzer);
        return this;
    }

    public allowLeadingWildCard(value:boolean): EsQueryStringQuery {
        this.setProperty('allow_leading_wildcard', value);
        return this;
    }

    public enablePositionIncrement(value:boolean): EsQueryStringQuery {
        this.setProperty('enable_position_increment', value);
        return this;
    }

    public fuzzyMaxExpansions(value:number): EsQueryStringQuery {
        this.setProperty('fuzzy_max_expansions', value);
        return this;
    }

    public fuzziness(value:string): EsQueryStringQuery {
        this.setProperty('fuzziness', value);
        return this;
    }

    public fuzzyPrefixLength(value:number): EsQueryStringQuery {
        this.setProperty('fuzzy_prefix_length', value);
        return this;
    }

    public phraseSlop(value:number): EsQueryStringQuery {
        this.setProperty('phrase_slop', value);
        return this;
    }

    public autoGeneratePhraseQueries(value:boolean): EsQueryStringQuery{
        this.setProperty('auto_generate_phrase_queries', value);
        return this;
    }

    public analyzeWildcard(value:boolean): EsQueryStringQuery {
        this.setProperty('analyze_wildcard', value);
        return this;
    }

    public maxDeterminizedStates(value:number): EsQueryStringQuery {

        this.setProperty('max_determinized_states',value);
        return this;
    }

    public minimumShouldMatching(value:number): EsQueryStringQuery{
        this.setProperty('minium_should_matching',value);
        return this;
    }

    public lenient(value:boolean): EsQueryStringQuery {
        this.setProperty('lenient',value);
        return this;
    }

    public timeZone(timezone:string): EsQueryStringQuery {
        this.setProperty('time_zone',timezone);
        return this;
    }

    public quoteFieldSuffix(pattern: string): EsQueryStringQuery {
        this.setProperty('quote_field_suffix', pattern);
        return this;
    }

    public splitOnWhitespace(value:boolean): EsQueryStringQuery {
        this.setProperty('split_on_whitespace', value);
        return this;
    }

    public allFields(value: boolean): EsQueryStringQuery {
        this.setProperty('all_fields', value);
        return this;
    }
}
