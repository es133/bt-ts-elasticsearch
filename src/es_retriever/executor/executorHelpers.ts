import {EsQueryDsl} from '../../interface/EsQueryDsl';
import {RankedHit, RetrieverResult, RetrieverTotal} from './RetrieverResult';

export function normalizeFilters(input: EsQueryDsl | EsQueryDsl[] | undefined): EsQueryDsl[] {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    return [input];
}

export function mapEsResponseToRetrieverResult(response: any): RetrieverResult {
    const hitsArray: any[] = response?.hits?.hits ?? [];
    const rankedIds: RankedHit[] = hitsArray.map((h) => ({
        id: h._id,
        index: h._index,
        score: h._score ?? 0,
        source: h._source,
        highlight: h.highlight,
    }));
    const total: RetrieverTotal = {
        value: response?.hits?.total?.value ?? 0,
        relation: response?.hits?.total?.relation ?? 'eq',
    };
    const result: RetrieverResult = {rankedIds, total};
    if (response?.aggregations !== undefined) {
        result.aggregations = response.aggregations;
    }
    return result;
}
