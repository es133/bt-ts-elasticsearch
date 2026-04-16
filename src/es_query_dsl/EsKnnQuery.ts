'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsKnnQuery extends EsAbstractQueryDsl {

    constructor(field: string, queryVector: number[], k: number, numCandidates: number) {
        super('knn');
        this.setProperty('field', field);
        this.setProperty('query_vector', queryVector);
        this.setProperty('k', k);
        this.setProperty('num_candidates', numCandidates);
    }

    public field(field: string): EsKnnQuery {
        this.setProperty('field', field);
        return this;
    }

    public queryVector(queryVector: number[]): EsKnnQuery {
        this.setProperty('query_vector', queryVector);
        return this;
    }

    public k(k: number): EsKnnQuery {
        this.setProperty('k', k);
        return this;
    }

    public numCandidates(numCandidates: number): EsKnnQuery {
        this.setProperty('num_candidates', numCandidates);
        return this;
    }

    public filter(filter: any): EsKnnQuery {
        this.setProperty('filter', filter);
        return this;
    }

    public similarity(similarity: number): EsKnnQuery {
        this.setProperty('similarity', similarity);
        return this;
    }

    public boost(value: number): EsKnnQuery {
        this.setProperty('boost', value);
        return this;
    }
}
