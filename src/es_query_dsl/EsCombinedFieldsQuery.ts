'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';
import {ES_QUERY_LOGIC_OPERATOR} from '../type/BtEsEnums';

export class EsCombinedFieldsQuery extends EsAbstractQueryDsl {

    constructor(query: string, fields: string[]) {
        super('combined_fields');
        this.setProperty('query', query);
        this.setProperty('fields', fields);
    }

    public query(query: string): EsCombinedFieldsQuery {
        this.setProperty('query', query);
        return this;
    }

    public fields(fields: string[]): EsCombinedFieldsQuery {
        this.setProperty('fields', fields);
        return this;
    }

    public operator(operator: ES_QUERY_LOGIC_OPERATOR): EsCombinedFieldsQuery {
        this.setProperty('operator', operator);
        return this;
    }

    public minimumShouldMatch(value: any): EsCombinedFieldsQuery {
        this.setProperty('minimum_should_match', value);
        return this;
    }

    public zeroTermsQuery(value: string): EsCombinedFieldsQuery {
        this.setProperty('zero_terms_query', value);
        return this;
    }

    public autoGenerateSynonymsPhraseQuery(value: boolean): EsCombinedFieldsQuery {
        this.setProperty('auto_generate_synonyms_phrase_query', value);
        return this;
    }

    public boost(value: number): EsCombinedFieldsQuery {
        this.setProperty('boost', value);
        return this;
    }
}
