import {BtEsSearchDao} from '../src/BtEsSearchDao';
import {BtEsAbstractSearchRequest} from '../src/bt_es_request/BtEsAbstractSearchRequest';
import {EsRetrieverBuilder} from '../src/es_retriever/EsRetrieverBuilder';
import {EsQueryBuilder} from '../src/es_query_dsl/EsQueryBuilder';
import {EsSearchOptionBuilder} from '../src/es_search_option/EsSearchOptionBuilder';
import {EsAggregationBuilder} from '../src/es_search_option/aggs/EsAggregationBuilder';
import {EsRetrieverPipeline} from '../src/es_retriever/executor/EsRetrieverPipeline';
import {RetrieverContext} from '../src/es_retriever/executor/RetrieverContext';
import {RetrieverResult} from '../src/es_retriever/executor/RetrieverResult';
import {EsRetriever} from '../src/interface/EsRetriever';

const fakeConfig = {buildConnectionConfig: () => ({node: 'http://localhost:9200'})};

class StubPipeline {
    public dispatchCalls: Array<{retriever: EsRetriever; context: RetrieverContext}> = [];
    public response: RetrieverResult = {rankedIds: [], total: {value: 0, relation: 'eq'}};

    async dispatch(retriever: EsRetriever, context: RetrieverContext): Promise<RetrieverResult> {
        this.dispatchCalls.push({retriever, context});
        return this.response;
    }

    register(): void { /* noop */ }
}

function buildDao(): BtEsSearchDao {
    return new BtEsSearchDao(fakeConfig as any);
}

function injectMocks(dao: BtEsSearchDao, mocks: {esClient?: any; pipeline?: any}): void {
    if (mocks.esClient) (dao as any).esClient = mocks.esClient;
    if (mocks.pipeline) (dao as any).pipeline = mocks.pipeline;
}

describe('BtEsSearchDao', () => {

    describe('native path - no retriever', () => {
        it('calls esClient.search with request.getParam() and wraps response', async () => {
            const fakeEsClient = {
                search: jest.fn().mockResolvedValue({
                    took: 1,
                    hits: {total: {value: 5, relation: 'eq'}, max_score: 1.0, hits: []},
                }),
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: fakeEsClient});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());

            const response = await dao.requestSearch(request);

            expect(fakeEsClient.search).toHaveBeenCalledTimes(1);
            expect(fakeEsClient.search).toHaveBeenCalledWith(request.getParam());
            expect(response.totalCount).toBe(5);
        });
    });

    describe('native path - retriever set with useClientSideRetriever=false', () => {
        it('calls esClient.search and skips the pipeline', async () => {
            const fakeEsClient = {
                search: jest.fn().mockResolvedValue({hits: {total: {value: 0, relation: 'eq'}, max_score: null, hits: []}}),
            };
            const stubPipeline = new StubPipeline();
            const dao = buildDao();
            injectMocks(dao, {esClient: fakeEsClient, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.useClientSideRetriever = false;
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            await dao.requestSearch(request);

            expect(fakeEsClient.search).toHaveBeenCalledTimes(1);
            expect(stubPipeline.dispatchCalls).toHaveLength(0);
            expect(fakeEsClient.search.mock.calls[0][0].body.retriever).toBeDefined();
        });
    });

    describe('client-side path - retriever set with default useClientSideRetriever=true', () => {
        it('dispatches via pipeline instead of esClient.search', async () => {
            const fakeEsClient = {search: jest.fn()};
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [{index: 'idx', id: 'a', score: 0.9, source: {t: 'A'}}],
                total: {value: 1, relation: 'eq'},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: fakeEsClient, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            const response = await dao.requestSearch(request);

            expect(fakeEsClient.search).not.toHaveBeenCalled();
            expect(stubPipeline.dispatchCalls).toHaveLength(1);
            expect(response.totalCount).toBe(1);
        });

        it('builds context with from / size / trackTotalHits / index', async () => {
            const stubPipeline = new StubPipeline();
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setSize(20);
            request.setFrom(40);
            request.trackTotalHits = false;
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            await dao.requestSearch(request);

            const ctx = stubPipeline.dispatchCalls[0].context;
            expect(ctx.from).toBe(40);
            expect(ctx.size).toBe(20);
            expect(ctx.trackTotalHits).toBe(false);
            expect(ctx.index).toBe('idx');
        });

        it('passes source / sort / highlight / postFilter / searchAfter via context', async () => {
            const stubPipeline = new StubPipeline();
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setSource(['t']);
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));
            request.addHighlight(EsSearchOptionBuilder.highlight(['title']));
            request.addSort(EsSearchOptionBuilder.sort('created_at', 'desc' as any));
            request.setPostFilter(EsQueryBuilder.termQuery('lang', 'ko'));
            request.setSearchAfter('cursor');

            await dao.requestSearch(request);

            const ctx = stubPipeline.dispatchCalls[0].context;
            expect(ctx.source).toEqual(['t']);
            expect(ctx.sort).toEqual({sort: expect.any(Array)});
            expect(ctx.highlight).toEqual({highlight: expect.any(Object)});
            expect(ctx.postFilter).toBeDefined();
            expect(ctx.searchAfter).toEqual(['cursor']);
        });

        it('defaults from to 0 and size to ES_SEARCH_DEFAULT_SIZE when not specified', async () => {
            const stubPipeline = new StubPipeline();
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            await dao.requestSearch(request);

            const ctx = stubPipeline.dispatchCalls[0].context;
            expect(ctx.from).toBe(0);
            expect(ctx.size).toBe(10);
        });

        it('synthesizes response.hits.hits from rankedIds preserving _index/_id/_score/_source/highlight', async () => {
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [
                    {index: 'idx', id: 'a', score: 0.9, source: {t: 'A'}, highlight: {t: ['<em>A</em>']}},
                    {index: 'idx', id: 'b', score: 0.7, source: {t: 'B'}},
                ],
                total: {value: 2, relation: 'eq'},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            const response = await dao.requestSearch(request);

            expect(response.totalCount).toBe(2);
            expect(response.hits?.hits).toHaveLength(2);
            expect(response.hits?.hits[0]).toEqual({
                _index: 'idx', _id: 'a', _score: 0.9, _source: {t: 'A'}, highlight: {t: ['<em>A</em>']},
            });
            expect(response.hits?.hits[1]).toEqual({
                _index: 'idx', _id: 'b', _score: 0.7, _source: {t: 'B'}, highlight: undefined,
            });
        });

        it('synthesizes maxScore from the top hit and null when empty', async () => {
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [
                    {index: 'idx', id: 'a', score: 0.987},
                    {index: 'idx', id: 'b', score: 0.5},
                ],
                total: {value: 2, relation: 'eq'},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            const response = await dao.requestSearch(request);
            expect(response.maxScore).toBe(0.987);

            stubPipeline.response = {rankedIds: [], total: {value: 0, relation: 'eq'}};
            const empty = await dao.requestSearch(request);
            expect(empty.maxScore).toBeNull();
        });

        it('preserves total.relation in response.hits.total', async () => {
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [{index: 'idx', id: 'a', score: 1}],
                total: {value: 100, relation: 'gte'},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            const response = await dao.requestSearch(request);
            expect(response.hits?.total).toEqual({value: 100, relation: 'gte'});
        });
    });

    describe('client-side path - aggregations', () => {
        it('passes aggregations from request into context and exposes them on the response', async () => {
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [{index: 'idx', id: 'a', score: 1}],
                total: {value: 1, relation: 'eq'},
                aggregations: {by_status: {buckets: [{key: 'open', doc_count: 5}]}},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));
            request.addAggregations(EsAggregationBuilder.termsAggregations('by_status', 'status'));

            const response = await dao.requestSearch(request);

            const ctx = stubPipeline.dispatchCalls[0].context;
            expect(ctx.aggregations).toEqual({aggregations: {by_status: {terms: {field: 'status'}}}});
            expect(response.aggregations).toEqual({by_status: {buckets: [{key: 'open', doc_count: 5}]}});
        });

        it('omits aggregations from response when result has none', async () => {
            const stubPipeline = new StubPipeline();
            stubPipeline.response = {
                rankedIds: [],
                total: {value: 0, relation: 'eq'},
            };
            const dao = buildDao();
            injectMocks(dao, {esClient: {search: jest.fn()}, pipeline: stubPipeline});

            const request = new BtEsAbstractSearchRequest();
            request.setIndex('idx');
            request.setRetriever(EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()));

            const response = await dao.requestSearch(request);
            expect(response.aggregations).toBeUndefined();
        });
    });

    describe('default pipeline lazy creation', () => {
        it('creates a default pipeline on first access', () => {
            const dao = buildDao();
            const pipeline = (dao as any).getPipeline();
            expect(pipeline).toBeInstanceOf(EsRetrieverPipeline);
        });

        it('reuses the same pipeline instance across calls', () => {
            const dao = buildDao();
            const first = (dao as any).getPipeline();
            const second = (dao as any).getPipeline();
            expect(second).toBe(first);
        });
    });
});
