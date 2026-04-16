'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsWrapperQuery extends EsAbstractQueryDsl {

    constructor(query: string) {
        super('wrapper');
        this.setProperty('query', query);
    }

    public query(query: string): EsWrapperQuery {
        this.setProperty('query', query);
        return this;
    }
}
