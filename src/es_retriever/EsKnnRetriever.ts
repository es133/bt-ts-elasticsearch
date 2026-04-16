'use strict';

import {EsAbstractRetriever} from './EsAbstractRetriever';
import {EsQueryDsl} from '../interface/EsQueryDsl';

export class EsKnnRetriever extends EsAbstractRetriever {
    constructor(field: string, queryVector: number[], k: number, numCandidates: number) {
        super('knn');
        this.setProperty('field', field);
        this.setProperty('query_vector', queryVector);
        this.setProperty('k', k);
        this.setProperty('num_candidates', numCandidates);
    }

    public field(field: string): EsKnnRetriever {
        this.setProperty('field', field);
        return this;
    }

    public queryVector(queryVector: number[]): EsKnnRetriever {
        this.setProperty('query_vector', queryVector);
        return this;
    }

    public k(k: number): EsKnnRetriever {
        this.setProperty('k', k);
        return this;
    }

    public numCandidates(numCandidates: number): EsKnnRetriever {
        this.setProperty('num_candidates', numCandidates);
        return this;
    }

    public filter(filter: EsQueryDsl | EsQueryDsl[]): EsKnnRetriever {
        this.setProperty('filter', filter);
        return this;
    }

    public similarity(similarity: number): EsKnnRetriever {
        this.setProperty('similarity', similarity);
        return this;
    }
}
