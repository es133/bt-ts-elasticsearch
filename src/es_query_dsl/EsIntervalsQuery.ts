'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsIntervalsQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string) {
        super('intervals');
        this.fieldName = field;
    }

    public match(query: string, maxGaps?: number, ordered?: boolean, analyzer?: string): EsIntervalsQuery {
        const matchObj: any = { query };
        if (maxGaps !== undefined) matchObj.max_gaps = maxGaps;
        if (ordered !== undefined) matchObj.ordered = ordered;
        if (analyzer) matchObj.analyzer = analyzer;
        this.setFieldProperty(this.fieldName, 'match', matchObj);
        return this;
    }

    public prefix(prefix: string, analyzer?: string): EsIntervalsQuery {
        const prefixObj: any = { prefix };
        if (analyzer) prefixObj.analyzer = analyzer;
        this.setFieldProperty(this.fieldName, 'prefix', prefixObj);
        return this;
    }

    public wildcard(pattern: string, analyzer?: string): EsIntervalsQuery {
        const wildcardObj: any = { pattern };
        if (analyzer) wildcardObj.analyzer = analyzer;
        this.setFieldProperty(this.fieldName, 'wildcard', wildcardObj);
        return this;
    }

    public fuzzy(term: string, prefixLength?: number, transpositions?: boolean, fuzziness?: string): EsIntervalsQuery {
        const fuzzyObj: any = { term };
        if (prefixLength !== undefined) fuzzyObj.prefix_length = prefixLength;
        if (transpositions !== undefined) fuzzyObj.transpositions = transpositions;
        if (fuzziness) fuzzyObj.fuzziness = fuzziness;
        this.setFieldProperty(this.fieldName, 'fuzzy', fuzzyObj);
        return this;
    }

    public allOf(intervals: any[], maxGaps?: number, ordered?: boolean, filter?: any): EsIntervalsQuery {
        const allOfObj: any = { intervals };
        if (maxGaps !== undefined) allOfObj.max_gaps = maxGaps;
        if (ordered !== undefined) allOfObj.ordered = ordered;
        if (filter) allOfObj.filter = filter;
        this.setFieldProperty(this.fieldName, 'all_of', allOfObj);
        return this;
    }

    public anyOf(intervals: any[]): EsIntervalsQuery {
        this.setFieldProperty(this.fieldName, 'any_of', { intervals });
        return this;
    }
}
