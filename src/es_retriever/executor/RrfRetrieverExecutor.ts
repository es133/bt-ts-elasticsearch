import {EsRetriever} from '../../interface/EsRetriever';
import {EsQueryDsl} from '../../interface/EsQueryDsl';
import {BtEsRequestUtil} from '../../bt_es_request/BtEsRequestUtil';
import {EsQueryBuilder} from '../../es_query_dsl/EsQueryBuilder';
import {EsRetrieverExecutor} from './EsRetrieverExecutor';
import {EsRetrieverDispatcher} from './EsRetrieverDispatcher';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult, RetrieverTotal} from './RetrieverResult';
import {normalizeFilters} from './executorHelpers';
import {rrfMerge, validateRrfPagination} from './rrfMerge';
import {ResultAssembler} from './ResultAssembler';

const RETRIEVER_NAME = 'rrf';
const STANDARD_RETRIEVER_NAME = 'standard';
const DEFAULT_RANK_WINDOW_SIZE = 100;
const DEFAULT_RANK_CONSTANT = 60;

export class RrfRetrieverExecutor implements EsRetrieverExecutor {

    private readonly assembler: ResultAssembler;

    constructor(assembler: ResultAssembler = new ResultAssembler()) {
        this.assembler = assembler;
    }

    public canHandle(retriever: EsRetriever): boolean {
        return retriever.name() === RETRIEVER_NAME;
    }

    public async execute(
        retriever: EsRetriever,
        context: RetrieverContext,
        dispatcher: EsRetrieverDispatcher
    ): Promise<RetrieverResult> {
        const rrfBody = retriever.body()[RETRIEVER_NAME] || {};
        const children: EsRetriever[] = rrfBody.retrievers || [];
        const rankWindowSize: number = rrfBody.rank_window_size ?? DEFAULT_RANK_WINDOW_SIZE;
        const rankConstant: number = rrfBody.rank_constant ?? DEFAULT_RANK_CONSTANT;

        this.validate(context, rankWindowSize);

        const childContext = this.buildChildContext(rrfBody, context, rankWindowSize);

        const wantsUnion = this.shouldComputeUnionTotal(context.trackTotalHits, children);

        const [childResults, unionTotalValue] = await Promise.all([
            Promise.all(children.map((c) => dispatcher.dispatch(c, childContext))),
            wantsUnion ? this.fetchUnionTotal(rrfBody, children, context) : Promise.resolve(null),
        ]);

        const merged = rrfMerge(
            childResults.map((r) => ({rankedIds: r.rankedIds})),
            {rankConstant}
        );

        const sliced = merged.rankedIds.slice(context.from, context.from + context.size);

        const total = this.computeTotal(
            context.trackTotalHits,
            childResults,
            merged.candidateCount,
            unionTotalValue
        );

        const aggregations = await this.fetchAggregationsForMergedPool(
            merged.rankedIds,
            context
        );

        const baseResult: RetrieverResult = aggregations !== null
            ? {rankedIds: sliced, total, aggregations}
            : {rankedIds: sliced, total};

        return this.assembler.assemble(baseResult, {
            client: context.client,
            index: context.index,
            source: context.source,
            highlight: context.highlight,
        });
    }

    private async fetchAggregationsForMergedPool(
        mergedHits: Array<{index: string; id: string}>,
        context: RetrieverContext
    ): Promise<Record<string, any> | null> {
        if (context.aggregations === undefined || mergedHits.length === 0) {
            return null;
        }
        const ids = mergedHits.map((h) => h.id);
        const body: Record<string, any> = {
            query: {ids: {values: ids}},
            size: 0,
        };
        Object.assign(body, context.aggregations);

        const response = await context.client.search({
            index: context.index,
            body,
        });
        return response?.aggregations ?? null;
    }

    private validate(context: RetrieverContext, rankWindowSize: number): void {
        if (context.sort !== undefined) {
            throw new Error('sort is not supported with rrf retriever. Remove sort or use a non-rrf retriever.');
        }
        if (context.searchAfter !== undefined) {
            throw new Error('search_after is not supported with rrf retriever. Use stateless pagination via from+size.');
        }
        validateRrfPagination(rankWindowSize, context.from, context.size);
    }

    private buildChildContext(
        rrfBody: Record<string, any>,
        context: RetrieverContext,
        rankWindowSize: number
    ): RetrieverContext {
        const ownFilters = normalizeFilters(rrfBody.filter);
        const parentFilters = normalizeFilters(context.parentFilter);
        const combined = [...ownFilters, ...parentFilters];

        return {
            client: context.client,
            index: context.index,
            from: 0,
            size: rankWindowSize,
            trackTotalHits: context.trackTotalHits,
            source: context.source,
            parentFilter: combined.length > 0 ? combined : undefined,
        };
    }

    private shouldComputeUnionTotal(trackFlag: boolean | number, children: EsRetriever[]): boolean {
        if (trackFlag === false || trackFlag === 0) return false;
        if (children.length === 0) return false;
        return children.every((c) => c.name() === STANDARD_RETRIEVER_NAME);
    }

    private async fetchUnionTotal(
        rrfBody: Record<string, any>,
        children: EsRetriever[],
        context: RetrieverContext
    ): Promise<number> {
        const shouldQueries = children.map((child) => this.buildStandardChildQueryDsl(child));
        const ownFilters = normalizeFilters(rrfBody.filter);
        const parentFilters = normalizeFilters(context.parentFilter);
        const allFilters = [...ownFilters, ...parentFilters];

        const bool: Record<string, any> = {
            should: shouldQueries,
            minimum_should_match: 1,
        };
        if (allFilters.length > 0) {
            bool.filter = allFilters.map((f) => BtEsRequestUtil.buildQueryParam(f));
        }

        const response = await context.client.search({
            index: context.index,
            body: {
                query: {bool},
                size: 0,
                track_total_hits: true,
            },
        });

        return response?.hits?.total?.value ?? 0;
    }

    private buildStandardChildQueryDsl(child: EsRetriever): Record<string, any> {
        const stdBody = child.body()[STANDARD_RETRIEVER_NAME] || {};
        const ownQuery: EsQueryDsl | undefined = stdBody.query;
        const ownFilters = normalizeFilters(stdBody.filter);

        if (ownFilters.length > 0) {
            const bool = EsQueryBuilder.boolQuery();
            if (ownQuery) bool.must(ownQuery);
            for (const f of ownFilters) bool.filter(f);
            return BtEsRequestUtil.buildQueryParam(bool);
        }
        if (ownQuery) {
            return BtEsRequestUtil.buildQueryParam(ownQuery);
        }
        return {match_all: {}};
    }

    private computeTotal(
        trackFlag: boolean | number,
        childResults: RetrieverResult[],
        candidateCount: number,
        unionTotal: number | null
    ): RetrieverTotal {
        const cap = typeof trackFlag === 'number' ? trackFlag : Infinity;

        if (trackFlag === false || trackFlag === 0) {
            return {value: Math.min(candidateCount, cap), relation: 'eq'};
        }

        if (unionTotal !== null) {
            return {value: Math.min(unionTotal, cap), relation: 'eq'};
        }

        const sum = childResults.reduce((s, r) => s + r.total.value, 0);
        return {value: Math.min(sum, cap), relation: 'gte'};
    }
}
