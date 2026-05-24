import {RrfRetrieverExecutor} from '../../../src/es_retriever/executor/RrfRetrieverExecutor';
import {EsRetrieverDispatcher} from '../../../src/es_retriever/executor/EsRetrieverDispatcher';
import {RetrieverContext} from '../../../src/es_retriever/executor/RetrieverContext';
import {RetrieverResult, RankedHit} from '../../../src/es_retriever/executor/RetrieverResult';
import {EsClientPort} from '../../../src/es_retriever/executor/EsClientPort';
import {EsRetriever} from '../../../src/interface/EsRetriever';
import {EsRetrieverBuilder} from '../../../src/es_retriever/EsRetrieverBuilder';
import {EsQueryBuilder} from '../../../src/es_query_dsl/EsQueryBuilder';

class MockDispatcher implements EsRetrieverDispatcher {
    public calls: Array<{retriever: EsRetriever; context: RetrieverContext}> = [];
    constructor(private readonly responder: (r: EsRetriever) => RetrieverResult) {}
    async dispatch(retriever: EsRetriever, context: RetrieverContext): Promise<RetrieverResult> {
        this.calls.push({retriever, context});
        return this.responder(retriever);
    }
}

class MockEsClient implements EsClientPort {
    public searchCalls: Array<Record<string, any>> = [];
    public searchResponse: any = {hits: {total: {value: 0, relation: 'eq'}, hits: []}};
    async search(params: Record<string, any>): Promise<any> {
        this.searchCalls.push(params);
        return this.searchResponse;
    }
    async msearch(): Promise<any> { throw new Error('not used'); }
    async mget(): Promise<any> { throw new Error('not used'); }
}

function hit(index: string, id: string, score = 1): RankedHit {
    return {index, id, score};
}

function result(rankedIds: RankedHit[], total = {value: rankedIds.length, relation: 'eq' as const}): RetrieverResult {
    return {rankedIds, total};
}

function makeContext(overrides: Partial<RetrieverContext> = {}, client?: EsClientPort): RetrieverContext {
    return {
        client: client ?? new MockEsClient(),
        index: 'test',
        from: 0,
        size: 10,
        trackTotalHits: false,
        ...overrides,
    };
}

describe('RrfRetrieverExecutor', () => {

    const executor = new RrfRetrieverExecutor();

    describe('canHandle', () => {
        it('returns true for rrf retriever', () => {
            expect(executor.canHandle(EsRetrieverBuilder.rrfRetriever())).toBe(true);
        });

        it('returns false for standard / knn', () => {
            expect(executor.canHandle(EsRetrieverBuilder.standardRetriever())).toBe(false);
            expect(executor.canHandle(EsRetrieverBuilder.knnRetriever('vec', [0.1], 10, 100))).toBe(false);
        });
    });

    describe('validation', () => {
        const dispatcher = new MockDispatcher(() => result([]));

        it('throws when context.sort is provided', async () => {
            const r = EsRetrieverBuilder.rrfRetriever([
                EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()),
            ]);
            const ctx = makeContext({sort: {sort: [{f: 'asc'}]}});
            await expect(executor.execute(r, ctx, dispatcher))
                .rejects.toThrow(/sort.*not supported.*rrf/i);
        });

        it('throws when context.searchAfter is provided', async () => {
            const r = EsRetrieverBuilder.rrfRetriever([
                EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()),
            ]);
            const ctx = makeContext({searchAfter: ['cursor']});
            await expect(executor.execute(r, ctx, dispatcher))
                .rejects.toThrow(/search_after.*not supported.*rrf/i);
        });

        it('throws when rank_window_size < from + size', async () => {
            const r = EsRetrieverBuilder.rrfRetriever([
                EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()),
            ]).rankWindowSize(100);
            const ctx = makeContext({from: 91, size: 10});

            await expect(executor.execute(r, ctx, dispatcher))
                .rejects.toThrow(/rank_window_size\(100\)/);
        });

        it('accepts boundary case rank_window_size == from + size', async () => {
            const r = EsRetrieverBuilder.rrfRetriever([
                EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery()),
            ]).rankWindowSize(100);
            const ctx = makeContext({from: 90, size: 10});

            await expect(executor.execute(r, ctx, dispatcher)).resolves.toBeDefined();
        });
    });

    describe('child dispatch', () => {
        it('dispatches every child retriever once', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', '1'));
            const c2 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', '2'));
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            await executor.execute(r, makeContext(), dispatcher);

            expect(dispatcher.calls).toHaveLength(2);
            expect(dispatcher.calls.map((c) => c.retriever)).toEqual([c1, c2]);
        });

        it('passes context.client and index to each child', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, makeContext({index: 'idx-1'}, client), dispatcher);

            expect(dispatcher.calls[0].context.client).toBe(client);
            expect(dispatcher.calls[0].context.index).toBe('idx-1');
        });

        it('sets child context from=0 and size=rank_window_size', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]).rankWindowSize(50);

            await executor.execute(r, makeContext({from: 5, size: 10}), dispatcher);

            expect(dispatcher.calls[0].context.from).toBe(0);
            expect(dispatcher.calls[0].context.size).toBe(50);
        });

        it('does not propagate sort or searchAfter to children', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, makeContext(), dispatcher);

            expect(dispatcher.calls[0].context.sort).toBeUndefined();
            expect(dispatcher.calls[0].context.searchAfter).toBeUndefined();
        });

        it('does not propagate highlight to children (highlight applied after merge)', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const ctx = makeContext({highlight: {highlight: {fields: {t: {}}}}});
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, ctx, dispatcher);

            expect(dispatcher.calls[0].context.highlight).toBeUndefined();
        });

        it('propagates _source to children', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, makeContext({source: ['t']}), dispatcher);

            expect(dispatcher.calls[0].context.source).toEqual(['t']);
        });
    });

    describe('filter pushdown', () => {
        it('passes rrf.filter as child parentFilter', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const rrfFilter = EsQueryBuilder.termQuery('lang', 'ko');
            const r = EsRetrieverBuilder.rrfRetriever([c1]).filter(rrfFilter);

            await executor.execute(r, makeContext(), dispatcher);

            expect(dispatcher.calls[0].context.parentFilter).toEqual([rrfFilter]);
        });

        it('combines context.parentFilter and rrf.filter for children', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const ownFilter = EsQueryBuilder.termQuery('lang', 'ko');
            const parentFilter = EsQueryBuilder.termQuery('tenant', 't1');
            const ctx = makeContext({parentFilter});
            const r = EsRetrieverBuilder.rrfRetriever([c1]).filter(ownFilter);

            await executor.execute(r, ctx, dispatcher);

            expect(dispatcher.calls[0].context.parentFilter).toEqual([ownFilter, parentFilter]);
        });

        it('leaves parentFilter undefined when no filters anywhere', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, makeContext(), dispatcher);

            expect(dispatcher.calls[0].context.parentFilter).toBeUndefined();
        });
    });

    describe('rrf merge and pagination slice', () => {
        it('merges children results using rrf score and sorts', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const c2 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher((r) => {
                if (r === c1) return result([hit('docs', 'a'), hit('docs', 'b')]);
                if (r === c2) return result([hit('docs', 'a'), hit('docs', 'c')]);
                throw new Error('unexpected');
            });
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            const out = await executor.execute(r, makeContext({size: 10}), dispatcher);

            expect(out.rankedIds[0].id).toBe('a');
            expect(out.rankedIds[0].score).toBeCloseTo(1 / 61 + 1 / 61, 10);
        });

        it('respects from + size slicing on merged results', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const allHits: RankedHit[] = [];
            for (let i = 0; i < 20; i++) {
                allHits.push(hit('docs', `id-${String(i).padStart(2, '0')}`));
            }
            const dispatcher = new MockDispatcher(() => result(allHits));
            const r = EsRetrieverBuilder.rrfRetriever([c1]).rankWindowSize(20);

            const out = await executor.execute(r, makeContext({from: 5, size: 5}), dispatcher);

            expect(out.rankedIds.map((h) => h.id))
                .toEqual(['id-05', 'id-06', 'id-07', 'id-08', 'id-09']);
        });

        it('uses default rank_constant=60 when not specified', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            const out = await executor.execute(r, makeContext(), dispatcher);
            expect(out.rankedIds[0].score).toBeCloseTo(1 / 61, 10);
        });

        it('uses configured rank_constant', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]).rankConstant(10);

            const out = await executor.execute(r, makeContext(), dispatcher);
            expect(out.rankedIds[0].score).toBeCloseTo(1 / 11, 10);
        });

        it('uses default rank_window_size=100 when not specified', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, makeContext(), dispatcher);
            expect(dispatcher.calls[0].context.size).toBe(100);
        });
    });

    describe('track_total_hits = false', () => {
        it('returns candidate count as total without firing union query', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const c2 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher((r) => {
                if (r === c1) return result([hit('docs', 'a'), hit('docs', 'b')]);
                return result([hit('docs', 'b'), hit('docs', 'c')]);
            });
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            const out = await executor.execute(r, makeContext({trackTotalHits: false}, client), dispatcher);

            expect(out.total).toEqual({value: 3, relation: 'eq'});
            expect(client.searchCalls).toHaveLength(0);
        });
    });

    describe('track_total_hits = true with all-standard children', () => {
        it('fires a single extra union search with size:0 and track_total_hits:true', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {total: {value: 42, relation: 'eq'}, hits: []}};
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', 'x'));
            const c2 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', 'y'));
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            await executor.execute(r, makeContext({trackTotalHits: true, index: 'idx-1'}, client), dispatcher);

            expect(client.searchCalls).toHaveLength(1);
            const params = client.searchCalls[0];
            expect(params.index).toBe('idx-1');
            expect(params.body.size).toBe(0);
            expect(params.body.track_total_hits).toBe(true);
        });

        it('union query body uses bool.should with minimum_should_match:1', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {total: {value: 5, relation: 'eq'}, hits: []}};
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', 'x'));
            const c2 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('t', 'y'));
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            await executor.execute(r, makeContext({trackTotalHits: true}, client), dispatcher);
            const body = client.searchCalls[0].body;

            expect(body.query.bool.minimum_should_match).toBe(1);
            expect(body.query.bool.should).toEqual([
                {match: {t: {query: 'x'}}},
                {match: {t: {query: 'y'}}},
            ]);
        });

        it('returns union total with relation eq', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {total: {value: 42, relation: 'eq'}, hits: []}};
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            const out = await executor.execute(r, makeContext({trackTotalHits: true}, client), dispatcher);

            expect(out.total).toEqual({value: 42, relation: 'eq'});
        });

        it('union query includes rrf.filter and parentFilter as bool.filter', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {total: {value: 1, relation: 'eq'}, hits: []}};
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1])
                .filter(EsQueryBuilder.termQuery('lang', 'ko'));
            const ctx = makeContext({
                trackTotalHits: true,
                parentFilter: EsQueryBuilder.termQuery('tenant', 't1'),
            }, client);

            await executor.execute(r, ctx, dispatcher);
            const filter = client.searchCalls[0].body.query.bool.filter;

            expect(filter).toEqual([
                {term: {lang: {value: 'ko'}}},
                {term: {tenant: {value: 't1'}}},
            ]);
        });
    });

    describe('track_total_hits = true with knn child', () => {
        it('does not fire union query and returns gte sum of child totals', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const c2 = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);
            const dispatcher = new MockDispatcher((r) => {
                if (r === c1) return result([hit('docs', 'a')], {value: 30, relation: 'eq'});
                return result([hit('docs', 'b')], {value: 12, relation: 'eq'});
            });
            const r = EsRetrieverBuilder.rrfRetriever([c1, c2]);

            const out = await executor.execute(r, makeContext({trackTotalHits: true}, client), dispatcher);

            expect(out.total).toEqual({value: 42, relation: 'gte'});
            expect(client.searchCalls).toHaveLength(0);
        });
    });

    describe('aggregations', () => {
        it('does not propagate aggregations to children', async () => {
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const ctx = makeContext({aggregations: {aggregations: {a: {terms: {field: 'f'}}}}});
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            await executor.execute(r, ctx, dispatcher);

            expect(dispatcher.calls[0].context.aggregations).toBeUndefined();
        });

        it('fires extra ids+aggs search after merge when aggregations and merged pool present', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {total: {value: 0, relation: 'eq'}, hits: []},
                aggregations: {by_status: {buckets: [{key: 'open', doc_count: 7}]}},
            };
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([
                hit('docs', 'a'), hit('docs', 'b'), hit('docs', 'c'),
            ]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);
            const aggs = {aggregations: {by_status: {terms: {field: 'status'}}}};

            const out = await executor.execute(r, makeContext({aggregations: aggs}, client), dispatcher);

            expect(client.searchCalls).toHaveLength(1);
            const params = client.searchCalls[0];
            expect(params.body.size).toBe(0);
            expect(params.body.query).toEqual({ids: {values: ['a', 'b', 'c']}});
            expect(params.body.aggregations).toEqual({by_status: {terms: {field: 'status'}}});
            expect(out.aggregations).toEqual({by_status: {buckets: [{key: 'open', doc_count: 7}]}});
        });

        it('does not fire extra search when no aggregations requested', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            const out = await executor.execute(r, makeContext({}, client), dispatcher);

            expect(client.searchCalls).toHaveLength(0);
            expect(out.aggregations).toBeUndefined();
        });

        it('does not fire extra search when merged pool is empty', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);
            const aggs = {aggregations: {a: {terms: {field: 'f'}}}};

            const out = await executor.execute(r, makeContext({aggregations: aggs}, client), dispatcher);

            expect(client.searchCalls).toHaveLength(0);
            expect(out.aggregations).toBeUndefined();
        });

        it('uses merged pool ids (full pool, not just sliced page)', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {hits: []}, aggregations: {x: {value: 1}}};
            const allHits = ['a', 'b', 'c', 'd', 'e'].map((id) => hit('docs', id));
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result(allHits));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);
            const aggs = {aggregations: {x: {avg: {field: 'f'}}}};

            await executor.execute(r, makeContext({from: 0, size: 2, aggregations: aggs}, client), dispatcher);

            expect(client.searchCalls[0].body.query.ids.values).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });

    describe('track_total_hits as numeric cap', () => {
        it('caps total at the provided number when all children are standard', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {total: {value: 999, relation: 'eq'}, hits: []}};
            const c1 = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')]));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            const out = await executor.execute(r, makeContext({trackTotalHits: 100}, client), dispatcher);

            expect(out.total).toEqual({value: 100, relation: 'eq'});
        });

        it('caps total at the provided number for gte path', async () => {
            const client = new MockEsClient();
            const c1 = EsRetrieverBuilder.knnRetriever('vec', [0.1], 50, 200);
            const dispatcher = new MockDispatcher(() => result([hit('docs', 'a')], {value: 9999, relation: 'eq'}));
            const r = EsRetrieverBuilder.rrfRetriever([c1]);

            const out = await executor.execute(r, makeContext({trackTotalHits: 100}, client), dispatcher);

            expect(out.total).toEqual({value: 100, relation: 'gte'});
        });
    });
});
