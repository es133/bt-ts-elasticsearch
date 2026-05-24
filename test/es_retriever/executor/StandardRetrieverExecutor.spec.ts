import {StandardRetrieverExecutor} from '../../../src/es_retriever/executor/StandardRetrieverExecutor';
import {EsRetrieverPipeline} from '../../../src/es_retriever/executor/EsRetrieverPipeline';
import {RetrieverContext} from '../../../src/es_retriever/executor/RetrieverContext';
import {EsClientPort} from '../../../src/es_retriever/executor/EsClientPort';
import {EsRetrieverBuilder} from '../../../src/es_retriever/EsRetrieverBuilder';
import {EsQueryBuilder} from '../../../src/es_query_dsl/EsQueryBuilder';

class MockEsClient implements EsClientPort {
    public searchCalls: Array<Record<string, any>> = [];
    public searchResponse: any = {
        hits: {
            hits: [],
            total: {value: 0, relation: 'eq'},
            max_score: null,
        },
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
        index: 'test-index',
        from: 0,
        size: 10,
        trackTotalHits: true,
        ...overrides,
    };
}

describe('StandardRetrieverExecutor', () => {

    const executor = new StandardRetrieverExecutor();
    const pipeline = new EsRetrieverPipeline([executor]);

    describe('canHandle', () => {
        it('returns true for standard retriever', () => {
            const r = EsRetrieverBuilder.standardRetriever();
            expect(executor.canHandle(r)).toBe(true);
        });

        it('returns false for knn retriever', () => {
            const r = EsRetrieverBuilder.knnRetriever('vec', [1, 2], 10, 100);
            expect(executor.canHandle(r)).toBe(false);
        });

        it('returns false for rrf retriever', () => {
            const r = EsRetrieverBuilder.rrfRetriever();
            expect(executor.canHandle(r)).toBe(false);
        });
    });

    describe('execute - search call', () => {
        it('calls client.search with index from context', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({index: 'my-index'}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('title', 'hi'));

            await executor.execute(r, ctx, pipeline);

            expect(client.searchCalls).toHaveLength(1);
            expect(client.searchCalls[0].index).toBe('my-index');
        });

        it('passes from / size / track_total_hits in body', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({from: 5, size: 25, trackTotalHits: false}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.from).toBe(5);
            expect(body.size).toBe(25);
            expect(body.track_total_hits).toBe(false);
        });
    });

    describe('execute - query and filter composition', () => {
        it('passes query directly when no filters present', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({}, client);
            const r = EsRetrieverBuilder.standardRetriever(
                EsQueryBuilder.matchQuery('title', 'hello')
            );

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query).toEqual({match: {title: {query: 'hello'}}});
        });

        it('wraps query in bool when retriever has filter', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('title', 'hi'))
                .filter(EsQueryBuilder.termQuery('status', 'published'));

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query).toEqual({
                bool: {
                    must: [{match: {title: {query: 'hi'}}}],
                    filter: [{term: {status: {value: 'published'}}}],
                },
            });
        });

        it('wraps with multiple filters when filter is an array', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .filter([
                    EsQueryBuilder.termQuery('a', '1'),
                    EsQueryBuilder.termQuery('b', '2'),
                ]);

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query.bool.filter).toEqual([
                {term: {a: {value: '1'}}},
                {term: {b: {value: '2'}}},
            ]);
        });

        it('appends parentFilter from context to retriever filters', async () => {
            const client = new MockEsClient();
            const parent = EsQueryBuilder.termQuery('tenant', 't1');
            const ctx = makeContext({parentFilter: parent}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .filter(EsQueryBuilder.termQuery('status', 'open'));

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query.bool.filter).toEqual([
                {term: {status: {value: 'open'}}},
                {term: {tenant: {value: 't1'}}},
            ]);
        });

        it('uses parentFilter only when retriever has no own filter', async () => {
            const client = new MockEsClient();
            const parent = EsQueryBuilder.termQuery('tenant', 't1');
            const ctx = makeContext({parentFilter: parent}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchQuery('title', 'x'));

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query).toEqual({
                bool: {
                    must: [{match: {title: {query: 'x'}}}],
                    filter: [{term: {tenant: {value: 't1'}}}],
                },
            });
        });

        it('omits query field entirely when retriever has neither query nor filter', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({}, client);
            const r = EsRetrieverBuilder.standardRetriever();

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query).toBeUndefined();
        });

        it('builds bool with only filter when no query but parentFilter present', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({parentFilter: EsQueryBuilder.termQuery('a', '1')}, client);
            const r = EsRetrieverBuilder.standardRetriever();

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.query).toEqual({
                bool: {
                    filter: [{term: {a: {value: '1'}}}],
                },
            });
        });
    });

    describe('execute - sort and search_after', () => {
        it('uses retriever sort when set', async () => {
            const client = new MockEsClient();
            const ctxSort = {sort: [{some_field: 'desc'}]};
            const ctx = makeContext({sort: ctxSort}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .sort([{retriever_field: 'asc'}]);

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.sort).toEqual([{retriever_field: 'asc'}]);
        });

        it('falls back to context sort when retriever has none', async () => {
            const client = new MockEsClient();
            const ctxSort = {sort: [{ctx_field: 'desc'}]};
            const ctx = makeContext({sort: ctxSort}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.sort).toEqual([{ctx_field: 'desc'}]);
        });

        it('uses retriever search_after when set', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({searchAfter: ['ctx-cursor']}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .searchAfter([42, 'doc-1']);

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.search_after).toEqual([42, 'doc-1']);
        });

        it('falls back to context searchAfter when retriever has none', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({searchAfter: ['ctx-cursor', 1]}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            const body = client.searchCalls[0].body;

            expect(body.search_after).toEqual(['ctx-cursor', 1]);
        });
    });

    describe('execute - retriever-level optional fields', () => {
        it('passes collapse', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .collapse('user_id');

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.collapse).toEqual({field: 'user_id'});
        });

        it('passes min_score', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .minScore(0.5);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.min_score).toBe(0.5);
        });

        it('passes terminate_after', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery())
                .terminateAfter(1000);

            await executor.execute(r, makeContext({}, client), pipeline);
            expect(client.searchCalls[0].body.terminate_after).toBe(1000);
        });
    });

    describe('execute - context fields', () => {
        it('passes _source', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({source: ['title', 'content']}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body._source).toEqual(['title', 'content']);
        });

        it('merges highlight body fragment', async () => {
            const client = new MockEsClient();
            const highlight = {highlight: {fields: {title: {}}}};
            const ctx = makeContext({highlight}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.highlight).toEqual({fields: {title: {}}});
        });

        it('builds post_filter from EsQueryDsl', async () => {
            const client = new MockEsClient();
            const ctx = makeContext({postFilter: EsQueryBuilder.termQuery('lang', 'ko')}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.post_filter).toEqual({term: {lang: {value: 'ko'}}});
        });
    });

    describe('execute - aggregations', () => {
        it('passes context.aggregations into body when set', async () => {
            const client = new MockEsClient();
            const aggs = {aggregations: {by_status: {terms: {field: 'status'}}}};
            const ctx = makeContext({aggregations: aggs}, client);
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            await executor.execute(r, ctx, pipeline);
            expect(client.searchCalls[0].body.aggregations).toEqual({by_status: {terms: {field: 'status'}}});
        });

        it('maps response.aggregations into result.aggregations', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {total: {value: 0, relation: 'eq'}, hits: []},
                aggregations: {by_status: {buckets: [{key: 'open', doc_count: 3}]}},
            };
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            const result = await executor.execute(r, makeContext({}, client), pipeline);
            expect(result.aggregations).toEqual({by_status: {buckets: [{key: 'open', doc_count: 3}]}});
        });

        it('omits aggregations from result when response has none', async () => {
            const client = new MockEsClient();
            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());

            const result = await executor.execute(r, makeContext({}, client), pipeline);
            expect(result.aggregations).toBeUndefined();
        });
    });

    describe('execute - response mapping', () => {
        it('maps hits to RankedHit array', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    total: {value: 42, relation: 'eq'},
                    max_score: 1.5,
                    hits: [
                        {_index: 'docs', _id: 'a', _score: 1.5, _source: {title: 'A'}},
                        {_index: 'docs', _id: 'b', _score: 1.0, _source: {title: 'B'}, highlight: {title: ['<em>B</em>']}},
                    ],
                },
            };

            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const result = await executor.execute(r, makeContext({}, client), pipeline);

            expect(result.rankedIds).toEqual([
                {id: 'a', index: 'docs', score: 1.5, source: {title: 'A'}, highlight: undefined},
                {id: 'b', index: 'docs', score: 1.0, source: {title: 'B'}, highlight: {title: ['<em>B</em>']}},
            ]);
            expect(result.total).toEqual({value: 42, relation: 'eq'});
        });

        it('defaults total to {value:0, relation:eq} when missing', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {hits: []}};

            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const result = await executor.execute(r, makeContext({}, client), pipeline);

            expect(result.rankedIds).toEqual([]);
            expect(result.total).toEqual({value: 0, relation: 'eq'});
        });

        it('defaults score to 0 when _score is null', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    total: {value: 1, relation: 'eq'},
                    hits: [{_index: 'docs', _id: 'x', _score: null, _source: {}}],
                },
            };

            const r = EsRetrieverBuilder.standardRetriever(EsQueryBuilder.matchAllQuery());
            const result = await executor.execute(r, makeContext({}, client), pipeline);

            expect(result.rankedIds[0].score).toBe(0);
        });
    });
});
