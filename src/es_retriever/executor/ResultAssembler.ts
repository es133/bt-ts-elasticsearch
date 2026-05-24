import {EsClientPort} from './EsClientPort';
import {RankedHit, RetrieverResult} from './RetrieverResult';

export type SourceSpec =
    | boolean
    | string
    | string[]
    | { includes?: string[]; excludes?: string[] };

export type ResultAssemblerOptions = {
    client: EsClientPort;
    index: string | string[];
    source?: SourceSpec;
    highlight?: Record<string, any>;
};

function docKey(index: string, id: string): string {
    return `${index}/${id}`;
}

export class ResultAssembler {

    public async assemble(result: RetrieverResult, options: ResultAssemblerOptions): Promise<RetrieverResult> {
        if (result.rankedIds.length === 0) {
            return result;
        }

        const wantsHighlight = options.highlight !== undefined;
        const wantsSource = options.source !== undefined && options.source !== false;

        if (!wantsHighlight && !wantsSource) {
            return result;
        }

        if (wantsHighlight) {
            return this.assembleViaSearch(result, options);
        }

        const missingSource = result.rankedIds.filter((h) => h.source === undefined);
        if (missingSource.length === 0) {
            return result;
        }

        return this.assembleViaMget(result, missingSource, options);
    }

    private async assembleViaSearch(result: RetrieverResult, options: ResultAssemblerOptions): Promise<RetrieverResult> {
        const ids = result.rankedIds.map((h) => h.id);

        const body: Record<string, any> = {
            query: {ids: {values: ids}},
            size: ids.length,
        };
        if (options.source !== undefined) {
            body._source = options.source;
        }
        if (options.highlight) {
            Object.assign(body, options.highlight);
        }

        const response = await options.client.search({
            index: options.index,
            body,
        });

        const hitsArray: any[] = response?.hits?.hits ?? [];
        const sourceMap = new Map<string, any>();
        const highlightMap = new Map<string, any>();
        for (const h of hitsArray) {
            const key = docKey(h._index, h._id);
            sourceMap.set(key, h._source);
            highlightMap.set(key, h.highlight);
        }

        const enriched: RankedHit[] = result.rankedIds.map((h) => {
            const key = docKey(h.index, h.id);
            return {
                ...h,
                source: sourceMap.has(key) ? sourceMap.get(key) : h.source,
                highlight: highlightMap.has(key) ? highlightMap.get(key) : h.highlight,
            };
        });

        return {rankedIds: enriched, total: result.total};
    }

    private async assembleViaMget(
        result: RetrieverResult,
        missing: RankedHit[],
        options: ResultAssemblerOptions
    ): Promise<RetrieverResult> {
        const sourceSpec = options.source ?? true;
        const docs = missing.map((h) => ({
            _index: h.index,
            _id: h.id,
            _source: sourceSpec,
        }));

        const response = await options.client.mget({body: {docs}});
        const mgetDocs: any[] = response?.docs ?? [];
        const sourceMap = new Map<string, any>();
        for (const d of mgetDocs) {
            if (d.found && d._source !== undefined) {
                sourceMap.set(docKey(d._index, d._id), d._source);
            }
        }

        const enriched: RankedHit[] = result.rankedIds.map((h) => {
            if (h.source !== undefined) return h;
            const key = docKey(h.index, h.id);
            if (sourceMap.has(key)) {
                return {...h, source: sourceMap.get(key)};
            }
            return h;
        });

        return {rankedIds: enriched, total: result.total};
    }
}
