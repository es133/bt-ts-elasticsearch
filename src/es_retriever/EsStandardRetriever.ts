'use strict';

import {EsAbstractRetriever} from './EsAbstractRetriever';
import {EsQueryDsl} from '../interface/EsQueryDsl';

export class EsStandardRetriever extends EsAbstractRetriever {
    constructor(query?: EsQueryDsl) {
        super('standard');
        if (query) {
            this.setProperty('query', query);
        }
    }

    public query(query: EsQueryDsl): EsStandardRetriever {
        this.setProperty('query', query);
        return this;
    }

    public filter(filter: EsQueryDsl | EsQueryDsl[]): EsStandardRetriever {
        this.setProperty('filter', filter);
        return this;
    }

    public collapse(field: string): EsStandardRetriever {
        this.setProperty('collapse', {field: field});
        return this;
    }

    public minScore(minScore: number): EsStandardRetriever {
        this.setProperty('min_score', minScore);
        return this;
    }

    public terminateAfter(terminateAfter: number): EsStandardRetriever {
        this.setProperty('terminate_after', terminateAfter);
        return this;
    }

    public searchAfter(searchAfter: any[]): EsStandardRetriever {
        this.setProperty('search_after', searchAfter);
        return this;
    }

    public sort(sort: any): EsStandardRetriever {
        this.setProperty('sort', sort);
        return this;
    }
}
