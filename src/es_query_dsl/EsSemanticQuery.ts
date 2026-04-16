'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsSemanticQuery extends EsAbstractQueryDsl {

    constructor(field: string, query: string) {
        super('semantic');
        this.setProperty('field', field);
        this.setProperty('query', query);
    }

    public field(field: string): EsSemanticQuery {
        this.setProperty('field', field);
        return this;
    }

    public query(query: string): EsSemanticQuery {
        this.setProperty('query', query);
        return this;
    }

    public boost(value: number): EsSemanticQuery {
        this.setProperty('boost', value);
        return this;
    }
}
