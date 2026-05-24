import {EsRetriever} from '../../interface/EsRetriever';
import {BtEsRequestUtil} from '../../bt_es_request/BtEsRequestUtil';
import {EsRetrieverExecutor} from './EsRetrieverExecutor';
import {EsRetrieverDispatcher} from './EsRetrieverDispatcher';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult} from './RetrieverResult';
import {mapEsResponseToRetrieverResult, normalizeFilters} from './executorHelpers';

const RETRIEVER_NAME = 'knn';

export class KnnRetrieverExecutor implements EsRetrieverExecutor {

    public canHandle(retriever: EsRetriever): boolean {
        return retriever.name() === RETRIEVER_NAME;
    }

    public async execute(
        retriever: EsRetriever,
        context: RetrieverContext,
        _dispatcher: EsRetrieverDispatcher
    ): Promise<RetrieverResult> {
        const knnBody = retriever.body()[RETRIEVER_NAME] || {};
        this.validatePagination(knnBody, context);

        const body = this.buildSearchBody(knnBody, context);
        const response = await context.client.search({
            index: context.index,
            body,
        });
        return mapEsResponseToRetrieverResult(response);
    }

    private validatePagination(knnBody: Record<string, any>, context: RetrieverContext): void {
        const required = context.from + context.size;
        if (knnBody.k < required) {
            throw new Error(
                `k(${knnBody.k}) must be >= from(${context.from}) + size(${context.size}) for knn retriever. ` +
                `Increase k or narrow pagination.`
            );
        }
    }

    private buildSearchBody(knnBody: Record<string, any>, context: RetrieverContext): Record<string, any> {
        const knn: Record<string, any> = {
            field: knnBody.field,
            query_vector: knnBody.query_vector,
            k: knnBody.k,
            num_candidates: knnBody.num_candidates,
        };

        const ownFilters = normalizeFilters(knnBody.filter);
        const parentFilters = normalizeFilters(context.parentFilter);
        const allFilters = [...ownFilters, ...parentFilters];
        if (allFilters.length > 0) {
            knn.filter = allFilters.map((f) => BtEsRequestUtil.buildQueryParam(f));
        }

        if (knnBody.similarity !== undefined) {
            knn.similarity = knnBody.similarity;
        }

        const body: Record<string, any> = {knn};
        body.from = context.from;
        body.size = context.size;
        body.track_total_hits = context.trackTotalHits;

        if (context.sort) Object.assign(body, context.sort);
        if (context.searchAfter !== undefined) body.search_after = context.searchAfter;
        if (context.source !== undefined) body._source = context.source;
        if (context.highlight) Object.assign(body, context.highlight);
        if (context.aggregations) Object.assign(body, context.aggregations);
        if (context.postFilter !== undefined) {
            body.post_filter = BtEsRequestUtil.buildQueryParam(context.postFilter);
        }

        return body;
    }
}
