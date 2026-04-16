'use strict';

import {EsStandardRetriever} from './EsStandardRetriever';
import {EsKnnRetriever} from './EsKnnRetriever';
import {EsRrfRetriever} from './EsRrfRetriever';
import {EsQueryDsl} from '../interface/EsQueryDsl';
import {EsRetriever} from '../interface/EsRetriever';

export class EsRetrieverBuilder {

    static standardRetriever(query?: EsQueryDsl): EsStandardRetriever {
        return new EsStandardRetriever(query);
    }

    static knnRetriever(field: string, queryVector: number[], k: number, numCandidates: number): EsKnnRetriever {
        return new EsKnnRetriever(field, queryVector, k, numCandidates);
    }

    static rrfRetriever(retrievers?: EsRetriever[], rankWindowSize?: number, rankConstant?: number): EsRrfRetriever {
        return new EsRrfRetriever(retrievers, rankWindowSize, rankConstant);
    }
}
