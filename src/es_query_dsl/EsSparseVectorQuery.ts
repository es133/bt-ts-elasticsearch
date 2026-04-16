'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsSparseVectorQuery extends EsAbstractQueryDsl {

    constructor(field: string, queryVector: Record<string, number>) {
        super('sparse_vector');
        this.setProperty('field', field);
        this.setProperty('query_vector', queryVector);
    }

    public field(field: string): EsSparseVectorQuery {
        this.setProperty('field', field);
        return this;
    }

    public queryVector(queryVector: Record<string, number>): EsSparseVectorQuery {
        this.setProperty('query_vector', queryVector);
        return this;
    }

    public pruningConfig(config: any): EsSparseVectorQuery {
        this.setProperty('pruning_config', config);
        return this;
    }

    public boost(value: number): EsSparseVectorQuery {
        this.setProperty('boost', value);
        return this;
    }
}
