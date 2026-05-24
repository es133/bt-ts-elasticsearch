'use strict';

import { BtEsAbstractDao } from './BtEsAbstractDao';
import { BtEsAbstractSearchRequest } from './bt_es_request/BtEsAbstractSearchRequest';
import { BtEsSearchResponse } from "./response/BtEsSearchResponse";
import { BtEsGenericResponse } from "./response/BtEsGenericResponse";
import { ES_SEARCH_DEFAULT_SIZE } from './type/BtEsEnums';
import { EsRetrieverDispatcher } from './es_retriever/executor/EsRetrieverDispatcher';
import { EsRetrieverPipeline } from './es_retriever/executor/EsRetrieverPipeline';
import { StandardRetrieverExecutor } from './es_retriever/executor/StandardRetrieverExecutor';
import { KnnRetrieverExecutor } from './es_retriever/executor/KnnRetrieverExecutor';
import { RrfRetrieverExecutor } from './es_retriever/executor/RrfRetrieverExecutor';
import { BtEsClientAdapter } from './es_retriever/executor/BtEsClientAdapter';
import { RetrieverContext } from './es_retriever/executor/RetrieverContext';
import { RetrieverResult } from './es_retriever/executor/RetrieverResult';

export class BtEsSearchDao extends BtEsAbstractDao {

    private pipeline: EsRetrieverDispatcher | null = null;

    public async requestSearch<T = unknown>(request: BtEsAbstractSearchRequest): Promise<BtEsSearchResponse<T>> {
        if (request.getRetriever() !== null && request.useClientSideRetriever) {
            return this.requestSearchViaPipeline<T>(request);
        }
        const response = await this.esClient.search(request.getParam());
        return new BtEsSearchResponse<T>(response);
    }

    public async requestScroll<T = unknown>(scrollId: string, scrollTimeout: string): Promise<BtEsSearchResponse<T>> {
        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        const param = {
            scroll_id: scrollId,
            scroll: scrollTimeout
        };

        const response = await this.esClient.scroll(param);
        return new BtEsSearchResponse(response);
    }

    public async deleteScroll(scrollId: string | Array<string>): Promise<BtEsGenericResponse> {
        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        let param = {
            scroll_id: scrollId
        };

        let response = await this.esClient.clearScroll(param);
        return new BtEsGenericResponse(response);
    }

    public async openPointInTime(request: any): Promise<string> {
        const response = await this.esClient.openPointInTime(request);
        return response?.id;
    }

    protected getPipeline(): EsRetrieverDispatcher {
        if (this.pipeline === null) {
            this.pipeline = this.buildDefaultPipeline();
        }
        return this.pipeline;
    }

    protected buildDefaultPipeline(): EsRetrieverDispatcher {
        return new EsRetrieverPipeline([
            new StandardRetrieverExecutor(),
            new KnnRetrieverExecutor(),
            new RrfRetrieverExecutor(),
        ]);
    }

    private async requestSearchViaPipeline<T>(request: BtEsAbstractSearchRequest): Promise<BtEsSearchResponse<T>> {
        const ctx = this.buildRetrieverContext(request);
        const result = await this.getPipeline().dispatch(request.getRetriever()!, ctx);
        return this.toSearchResponse<T>(result);
    }

    private buildRetrieverContext(request: BtEsAbstractSearchRequest): RetrieverContext {
        return {
            client: new BtEsClientAdapter(this.esClient),
            index: request.getIndex() as string | string[],
            from: request.getFrom() ?? 0,
            size: request.getSize() ?? ES_SEARCH_DEFAULT_SIZE,
            trackTotalHits: request.getTrackTotalHits(),
            sort: request.getSort() ?? undefined,
            postFilter: request.getPostFilter() ?? undefined,
            source: request.getSource(),
            highlight: request.getHighlight() ?? undefined,
            searchAfter: request.getSearchAfter() ?? undefined,
            aggregations: request.getAggregations() ?? undefined,
        };
    }

    private toSearchResponse<T>(result: RetrieverResult): BtEsSearchResponse<T> {
        const synthesized: Record<string, any> = {
            hits: {
                total: result.total,
                max_score: result.rankedIds[0]?.score ?? null,
                hits: result.rankedIds.map((h) => ({
                    _index: h.index,
                    _id: h.id,
                    _score: h.score,
                    _source: h.source,
                    highlight: h.highlight,
                })),
            },
        };
        if (result.aggregations !== undefined) {
            synthesized.aggregations = result.aggregations;
        }
        return new BtEsSearchResponse<T>(synthesized);
    }
}
