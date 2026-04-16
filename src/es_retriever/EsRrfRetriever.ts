'use strict';

import {EsAbstractRetriever} from './EsAbstractRetriever';
import {EsRetriever} from '../interface/EsRetriever';
import {EsQueryDsl} from '../interface/EsQueryDsl';

export class EsRrfRetriever extends EsAbstractRetriever {
    constructor(retrievers?: EsRetriever[], rankWindowSize?: number, rankConstant?: number) {
        super('rrf');
        if (retrievers && retrievers.length > 0) {
            this.setProperty('retrievers', retrievers);
        }
        if (rankWindowSize !== undefined) {
            this.setProperty('rank_window_size', rankWindowSize);
        }
        if (rankConstant !== undefined) {
            this.setProperty('rank_constant', rankConstant);
        }
    }

    public retrievers(retrievers: EsRetriever[]): EsRrfRetriever {
        this.setProperty('retrievers', retrievers);
        return this;
    }

    public addRetriever(retriever: EsRetriever): EsRrfRetriever {
        const current = this.retrieverBody[this.retrieverName]['retrievers'] || [];
        current.push(retriever);
        this.setProperty('retrievers', current);
        return this;
    }

    public rankWindowSize(rankWindowSize: number): EsRrfRetriever {
        this.setProperty('rank_window_size', rankWindowSize);
        return this;
    }

    public rankConstant(rankConstant: number): EsRrfRetriever {
        this.setProperty('rank_constant', rankConstant);
        return this;
    }

    public filter(filter: EsQueryDsl | EsQueryDsl[]): EsRrfRetriever {
        this.setProperty('filter', filter);
        return this;
    }
}
