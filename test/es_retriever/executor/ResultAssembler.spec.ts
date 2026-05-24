import {ResultAssembler, ResultAssemblerOptions} from '../../../src/es_retriever/executor/ResultAssembler';
import {RetrieverResult, RankedHit} from '../../../src/es_retriever/executor/RetrieverResult';
import {EsClientPort} from '../../../src/es_retriever/executor/EsClientPort';

class MockEsClient implements EsClientPort {
    public searchCalls: Array<Record<string, any>> = [];
    public mgetCalls: Array<Record<string, any>> = [];
    public searchResponse: any = {hits: {hits: []}};
    public mgetResponse: any = {docs: []};

    async search(params: Record<string, any>): Promise<any> {
        this.searchCalls.push(params);
        return this.searchResponse;
    }
    async msearch(): Promise<any> { throw new Error('not used'); }
    async mget(params: Record<string, any>): Promise<any> {
        this.mgetCalls.push(params);
        return this.mgetResponse;
    }
}

function hit(index: string, id: string, score = 1, source?: any, highlight?: any): RankedHit {
    return {index, id, score, source, highlight};
}

function makeOptions(overrides: Partial<ResultAssemblerOptions>, client?: EsClientPort): ResultAssemblerOptions {
    return {
        client: client ?? new MockEsClient(),
        index: 'docs',
        ...overrides,
    };
}

function makeResult(rankedIds: RankedHit[]): RetrieverResult {
    return {rankedIds, total: {value: rankedIds.length, relation: 'eq'}};
}

describe('ResultAssembler', () => {

    const assembler = new ResultAssembler();

    describe('no-op short circuits', () => {
        it('returns result unchanged when rankedIds is empty', async () => {
            const client = new MockEsClient();
            const result = makeResult([]);

            const out = await assembler.assemble(result, makeOptions({source: true, highlight: {highlight: {}}}, client));

            expect(out).toBe(result);
            expect(client.searchCalls).toHaveLength(0);
            expect(client.mgetCalls).toHaveLength(0);
        });

        it('returns result unchanged when no source / highlight options', async () => {
            const client = new MockEsClient();
            const result = makeResult([hit('docs', 'a')]);

            const out = await assembler.assemble(result, makeOptions({}, client));

            expect(out).toBe(result);
            expect(client.searchCalls).toHaveLength(0);
            expect(client.mgetCalls).toHaveLength(0);
        });

        it('returns result unchanged when all hits have source and no highlight requested', async () => {
            const client = new MockEsClient();
            const result = makeResult([
                hit('docs', 'a', 1, {t: 'A'}),
                hit('docs', 'b', 1, {t: 'B'}),
            ]);

            const out = await assembler.assemble(result, makeOptions({source: ['t']}, client));

            expect(out).toBe(result);
            expect(client.mgetCalls).toHaveLength(0);
        });

        it('returns result unchanged when source = false and no highlight', async () => {
            const client = new MockEsClient();
            const result = makeResult([hit('docs', 'a')]);

            const out = await assembler.assemble(result, makeOptions({source: false}, client));

            expect(out).toBe(result);
            expect(client.mgetCalls).toHaveLength(0);
        });
    });

    describe('mget enrichment for missing source', () => {
        it('fires mget when some hits are missing source', async () => {
            const client = new MockEsClient();
            client.mgetResponse = {
                docs: [
                    {_index: 'docs', _id: 'a', _source: {t: 'A'}, found: true},
                ],
            };
            const result = makeResult([hit('docs', 'a')]);

            const out = await assembler.assemble(result, makeOptions({source: true}, client));

            expect(client.mgetCalls).toHaveLength(1);
            expect(client.mgetCalls[0].body.docs).toEqual([
                {_index: 'docs', _id: 'a', _source: true},
            ]);
            expect(out.rankedIds[0].source).toEqual({t: 'A'});
        });

        it('respects source filter (string array) in mget docs entries', async () => {
            const client = new MockEsClient();
            client.mgetResponse = {docs: [{_index: 'docs', _id: 'a', _source: {t: 'A'}, found: true}]};
            const result = makeResult([hit('docs', 'a')]);

            await assembler.assemble(result, makeOptions({source: ['t', 'u']}, client));

            expect(client.mgetCalls[0].body.docs[0]._source).toEqual(['t', 'u']);
        });

        it('only fetches missing hits, leaving pre-existing source intact', async () => {
            const client = new MockEsClient();
            client.mgetResponse = {
                docs: [{_index: 'docs', _id: 'b', _source: {t: 'B'}, found: true}],
            };
            const result = makeResult([
                hit('docs', 'a', 1, {t: 'A-existing'}),
                hit('docs', 'b'),
            ]);

            const out = await assembler.assemble(result, makeOptions({source: true}, client));

            expect(client.mgetCalls[0].body.docs).toEqual([
                {_index: 'docs', _id: 'b', _source: true},
            ]);
            expect(out.rankedIds[0].source).toEqual({t: 'A-existing'});
            expect(out.rankedIds[1].source).toEqual({t: 'B'});
        });

        it('handles cross-index documents in mget docs[]', async () => {
            const client = new MockEsClient();
            client.mgetResponse = {
                docs: [
                    {_index: 'idx-1', _id: 'a', _source: {t: 'A'}, found: true},
                    {_index: 'idx-2', _id: 'a', _source: {t: 'A2'}, found: true},
                ],
            };
            const result = makeResult([hit('idx-1', 'a'), hit('idx-2', 'a')]);

            const out = await assembler.assemble(result, makeOptions({source: true}, client));

            expect(client.mgetCalls[0].body.docs).toEqual([
                {_index: 'idx-1', _id: 'a', _source: true},
                {_index: 'idx-2', _id: 'a', _source: true},
            ]);
            expect(out.rankedIds[0].source).toEqual({t: 'A'});
            expect(out.rankedIds[1].source).toEqual({t: 'A2'});
        });

        it('leaves source undefined for not_found docs', async () => {
            const client = new MockEsClient();
            client.mgetResponse = {
                docs: [{_index: 'docs', _id: 'a', found: false}],
            };
            const result = makeResult([hit('docs', 'a')]);

            const out = await assembler.assemble(result, makeOptions({source: true}, client));

            expect(out.rankedIds[0].source).toBeUndefined();
        });
    });

    describe('search route for highlight', () => {
        it('fires a search with ids query and highlight body fragment', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    hits: [
                        {_index: 'docs', _id: 'a', _source: {t: 'A'}, highlight: {t: ['<em>A</em>']}},
                        {_index: 'docs', _id: 'b', _source: {t: 'B'}, highlight: {t: ['<em>B</em>']}},
                    ],
                },
            };
            const result = makeResult([hit('docs', 'a'), hit('docs', 'b')]);

            const out = await assembler.assemble(result, makeOptions({
                source: true,
                highlight: {highlight: {fields: {t: {}}}},
            }, client));

            expect(client.searchCalls).toHaveLength(1);
            const params = client.searchCalls[0];
            expect(params.body.query).toEqual({ids: {values: ['a', 'b']}});
            expect(params.body.size).toBe(2);
            expect(params.body.highlight).toEqual({fields: {t: {}}});
            expect(params.body._source).toBe(true);

            expect(out.rankedIds[0].highlight).toEqual({t: ['<em>A</em>']});
            expect(out.rankedIds[1].highlight).toEqual({t: ['<em>B</em>']});
        });

        it('preserves rrf scores while overwriting source / highlight from search', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    hits: [{_index: 'docs', _id: 'a', _source: {t: 'A-fresh'}, highlight: {t: ['<em>A</em>']}}],
                },
            };
            const result: RetrieverResult = {
                rankedIds: [hit('docs', 'a', 0.987, {t: 'A-stale'})],
                total: {value: 1, relation: 'eq'},
            };

            const out = await assembler.assemble(result, makeOptions({
                source: true,
                highlight: {highlight: {fields: {t: {}}}},
            }, client));

            expect(out.rankedIds[0].score).toBe(0.987);
            expect(out.rankedIds[0].source).toEqual({t: 'A-fresh'});
            expect(out.rankedIds[0].highlight).toEqual({t: ['<em>A</em>']});
            expect(out.total).toBe(result.total);
        });

        it('handles cross-index ids in search route via _index/_id matching', async () => {
            const client = new MockEsClient();
            client.searchResponse = {
                hits: {
                    hits: [
                        {_index: 'idx-1', _id: 'a', highlight: {t: ['HL1']}},
                        {_index: 'idx-2', _id: 'a', highlight: {t: ['HL2']}},
                    ],
                },
            };
            const result = makeResult([hit('idx-1', 'a'), hit('idx-2', 'a')]);

            const out = await assembler.assemble(result, makeOptions({
                highlight: {highlight: {fields: {t: {}}}},
            }, client));

            expect(out.rankedIds[0].highlight).toEqual({t: ['HL1']});
            expect(out.rankedIds[1].highlight).toEqual({t: ['HL2']});
        });

        it('leaves highlight undefined for ids missing from search response', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {hits: []}};
            const result = makeResult([hit('docs', 'a'), hit('docs', 'b')]);

            const out = await assembler.assemble(result, makeOptions({
                highlight: {highlight: {fields: {t: {}}}},
            }, client));

            expect(out.rankedIds[0].highlight).toBeUndefined();
            expect(out.rankedIds[1].highlight).toBeUndefined();
        });

        it('does not also fire mget when search route was taken', async () => {
            const client = new MockEsClient();
            client.searchResponse = {hits: {hits: []}};
            const result = makeResult([hit('docs', 'a')]);

            await assembler.assemble(result, makeOptions({
                source: true,
                highlight: {highlight: {fields: {t: {}}}},
            }, client));

            expect(client.searchCalls).toHaveLength(1);
            expect(client.mgetCalls).toHaveLength(0);
        });
    });
});
