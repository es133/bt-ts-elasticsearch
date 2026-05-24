import {EsRetriever} from '../../interface/EsRetriever';
import {EsQueryDsl} from '../../interface/EsQueryDsl';
import {EsQueryBuilder} from '../../es_query_dsl/EsQueryBuilder';
import {BtEsRequestUtil} from '../../bt_es_request/BtEsRequestUtil';
import {EsRetrieverExecutor} from './EsRetrieverExecutor';
import {EsRetrieverDispatcher} from './EsRetrieverDispatcher';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult} from './RetrieverResult';
import {mapEsResponseToRetrieverResult, normalizeFilters} from './executorHelpers';

const RETRIEVER_NAME = 'standard';

export class StandardRetrieverExecutor implements EsRetrieverExecutor {

    public canHandle(retriever: EsRetriever): boolean {
        return retriever.name() === RETRIEVER_NAME;
    }

    public async execute(
        retriever: EsRetriever,
        context: RetrieverContext,
        _dispatcher: EsRetrieverDispatcher
    ): Promise<RetrieverResult> {
        const body = this.buildSearchBody(retriever, context);
        const response = await context.client.search({
            index: context.index,
            body,
        });
        return mapEsResponseToRetrieverResult(response);
    }

    private buildSearchBody(retriever: EsRetriever, context: RetrieverContext): Record<string, any> {
        const stdBody = retriever.body()[RETRIEVER_NAME] || {};
        const ownQuery: EsQueryDsl | undefined = stdBody.query;
        const ownFilters = normalizeFilters(stdBody.filter);
        const parentFilters = normalizeFilters(context.parentFilter);
        const allFilters = [...ownFilters, ...parentFilters];

        const body: Record<string, any> = {};

        if (allFilters.length > 0) {
            const bool = EsQueryBuilder.boolQuery();
            if (ownQuery) {
                bool.must(ownQuery);
            }
            for (const f of allFilters) {
                bool.filter(f);
            }
            body.query = BtEsRequestUtil.buildQueryParam(bool);
        } else if (ownQuery) {
            body.query = BtEsRequestUtil.buildQueryParam(ownQuery);
        }

        body.from = context.from;
        body.size = context.size;
        body.track_total_hits = context.trackTotalHits;

        if (stdBody.sort !== undefined) {
            body.sort = stdBody.sort;
        } else if (context.sort) {
            Object.assign(body, context.sort);
        }

        if (stdBody.search_after !== undefined) {
            body.search_after = stdBody.search_after;
        } else if (context.searchAfter !== undefined) {
            body.search_after = context.searchAfter;
        }

        if (stdBody.collapse !== undefined) body.collapse = stdBody.collapse;
        if (stdBody.min_score !== undefined) body.min_score = stdBody.min_score;
        if (stdBody.terminate_after !== undefined) body.terminate_after = stdBody.terminate_after;

        if (context.source !== undefined) body._source = context.source;
        if (context.highlight) Object.assign(body, context.highlight);
        if (context.aggregations) Object.assign(body, context.aggregations);
        if (context.postFilter !== undefined) {
            body.post_filter = BtEsRequestUtil.buildQueryParam(context.postFilter);
        }

        return body;
    }
}
