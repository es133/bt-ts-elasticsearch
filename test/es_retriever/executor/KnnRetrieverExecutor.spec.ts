import {KnnRetrieverExecutor} from '../../../src/es_retriever/executor/KnnRetrieverExecutor';
import {EsRetrieverPipeline} from '../../../src/es_retriever/executor/EsRetrieverPipeline';
import {RetrieverContext} from '../../../src/es_retriever/executor/RetrieverContext';
import {EsClientPort} from '../../../src/es_retriever/executor/EsClientPort';
import {EsRetrieverBuilder} from '../../../src/es_retriever/EsRetrieverBuilder';
import {EsQueryBuilder} from '../../../src/es_query_dsl/EsQueryBuilder';

class MockEsClient implements EsClientPort {
    public searchCalls: Array<Record<string, any>> = [];
    public searchResponse: any = {
        hits: {hits: [], total: {value: 0, relation: 'eq'}},
    };

    async search(params: Record<string, any>): Promise<any> {
        this.searchCalls.push(params);
        return this.searchResponse;
    }
    async msearch(): Promise<any> { throw new Error('not used'); }
    async mget(): Promise<any> { throw new Error('not used'); }
}

function makeContext(overrides: Partial<RetrieverContext> = {}, client?: EsClientPort): RetrieverContext {
    return {
        client: client ?? new MockEsClient(),
        index: 'vec-index',
        from: 0,
        size: 10,
        trackTotalHits: true,
        ...overrides,
    };
}

describe('KnnRetrieverExecutor', () => {

    const executor = new KnnRetrieverExecutor();
    const pipeline = new EsRetrieverPipeline([executor]);

    describe('canHandle', () => {
        it('returns true for knn retriever', () => {
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1, 0.2], 50, 200);
            expect(executor.canHandle(r)).toBe(true);
        });

        it('returns false for standard retriever', () => {
            const r = EsRetrieverBuilder.standardRetriever();
            expect(executor.canHandle(r)).toBe(false);
        });

        it('returns false for rrf retriever', () => {
            const r = EsRetrieverBuilder.rrfRetriever();
            expect(executor.canHandle(r)).toBe(false);
        });
    });

    describe('execute - top-level knn body', () => {
        it('calls client.search with index from context', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1, 0.2, 0.3], 50, 200);

            await executor.execute(r, makeContext({index: 'my-vec'}, client), pipeline);

            expect(client.searchCalls).toHaveLength(1);
            expect(client.searchCalls[0].index).toBe('my-vec');
        });

        it('emits top-level knn block with field/query_vector/k/num_candidates', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('embedding', [0.5, 0.6, 0.7], 50, 200);

            await executor.execute(r, makeContext({}, client), pipeline);
            const body = client.searchCalls[0].body;

            expect(body.knn).toEqual({
                field: 'embedding',
                query_vector: [0.5, 0.6, 0.7],
                k: 50,
                num_candidates: 200,
            });
        });

        it('passes from / size / track_total_hits at top level', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({from: 5, size: 25, trackTotalHits: false}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.from).toBe(5);
            expect(body.size).toBe(25);
            expect(body.track_total_hits).toBe(false);
        });

        it('omits knn.filter when no filter set anywhere', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.knn.filter).toBeUndefined();
        });
    });

    describe('execute - filter composition', () => {
        it('passes single retriever filter as array', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200)
                .filter(EsQueryBuilder.termQuery('lang', 'ko'));

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.knn.filter).toEqual([
                {term: {lang: {value: 'ko'}}},
            ]);
        });

        it('passes array of retriever filters as-is', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200)
                .filter([
                    EsQueryBuilder.termQuery('a', '1'),
                    EsQueryBuilder.termQuery('b', '2'),
                ]);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.knn.filter).toEqual([
                {term: {a: {value: '1'}}},
                {term: {b: {value: '2'}}},
            ]);
        });

        it('appends parentFilter to retriever filters', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({parentFilter: EsQueryBuilder.termQuery('tenant', 't1')}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200)
                .filter(EsQueryBuilder.termQuery('status', 'open'));

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.knn.filter).toEqual([
                {term: {status: {value: 'open'}}},
                {term: {tenant: {value: 't1'}}},
            ]);
        });

        it('uses parentFilter alone when retriever has no own filter', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({parentFilter: EsQueryBuilder.termQuery('tenant', 't1')}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.knn.filter).toEqual([
                {term: {tenant: {value: 't1'}}},
            ]);
        });
    });

    describe('execute - similarity', () => {
        it('passes similarity when set', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200).similarity(0.7);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.knn.similarity).toBe(0.7);
        });

        it('omits similarity when not set', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.knn.similarity).toBeUndefined();
        });
    });

    describe('execute - context fields pass-through', () => {
        it('passes _source', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, makeContext({source: ['title']}, client), pipeline);
            expect(client.searchCalls[0].body._source).toEqual(['title']);
        });

        it('merges highlight body fragment', async () => {
            const client = new MockEsClient();
            const highlight = {highlight: {fields: {title: {}}}};
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, makeContext({highlight}, client), pipeline);
            expect(client.searchCalls[0].body.highlight).toEqual({fields: {title: {}}});
        });

        it('builds post_filter from EsQueryDsl', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, makeContext({postFilter: EsQueryBuilder.termQuery('a', '1')}, client), pipeline);
            expect(client.searchCalls[0].body.post_filter).toEqual({term: {a: {value: '1'}}});
        });

        it('passes context.sort body fragment at top level', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({sort: {sort: [{score: 'desc'}]}}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.sort).toEqual([{score: 'desc'}]);
        });

        it('passes context.searchAfter at top level', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({searchAfter: ['c1', 5]}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.search_after).toEqual(['c1', 5]);
        });
    });

    describe('execute - pagination constraint k >= from+size', () => {
        it('accepts boundary case k == from + size', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({from: 90, size: 10}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 100, 200);

            await expect(executor.execute(r, ctx, pipeline)).resolves.toBeDefined();
            expect(client.searchCalls).toHaveLength(1);
        });

        it('throws when k < from + size', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({from: 91, size: 10}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 100, 200);

            await expect(executor.execute(r, ctx, pipeline))
                .rejects.toThrow(/k\(100\).*from\(91\).*size\(10\)/);
            expect(client.searchCalls).toHaveLength(0);
        });

        it('throws when from > 0 and from + size exceeds k', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({from: 50, size: 100}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 100, 200);

            await expect(executor.execute(r, ctx, pipeline)).rejects.toThrow(/k\(100\)/);
        });
    });

    describe('execute - aggregations', () => {
        it('passes context.aggregations into body when set', async () => {
            const client = new MockEsClient();
            const aggs = {aggregations: {by_status: {terms: {field: 'status'}}}};
            const ctx = makeContext({aggregations: aggs}, client);
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.aggregations).toEqual({by_status: {terms: {field: 'status'}}});
        });

        it('maps response.aggregations into result.aggregations', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {total: {value: 0, relation: 'eq'}, hits: []},
                aggregations: {avg_score: {value: 0.83}},
            };
            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);

            const result = await executor.execute(r, makeContext({}, client), pipeline);
            expect(result.aggregations).toEqual({avg_score: {value: 0.83}});
        });
    });

    describe('execute - response mapping', () => {
        it('maps hits to RankedHit array with total', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    total: {value: 3, relation: 'eq'},
                    hits: [
                        {_index: 'vec', _id: 'a', _score: 0.9, _source: {t: 'A'}},
                        {_index: 'vec', _id: 'b', _score: 0.7, _source: {t: 'B'}},
                    ],
                },
            };

            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);
            const result = await executor.execute(r, makeContext({}, client), pipeline);

            expect(result.rankedIds).toEqual([
                {id: 'a', index: 'vec', score: 0.9, source: {t: 'A'}, highlight: undefined},
                {id: 'b', index: 'vec', score: 0.7, source: {t: 'B'}, highlight: undefined},
            ]);
            expect(result.total).toEqual({value: 3, relation: 'eq'});
        });

        it('defaults total when missing', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {hits: []}};

            const r = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);
            const result = await executor.execute(r, makeContext({}, client), pipeline);

            expect(result.rankedIds).toEqual([]);
            expect(result.total).toEqual({value: 0, relation: 'eq'});
        });
    });
});
