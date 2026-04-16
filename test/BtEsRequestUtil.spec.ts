import { BtEsRequestUtil } from '../src/bt_es_request/BtEsRequestUtil';
import { EsQueryBuilder } from '../src/es_query_dsl/EsQueryBuilder';
import { EsAggregationBuilder } from '../src/es_search_option/aggs/EsAggregationBuilder';
import { EsRetrieverBuilder } from '../src/es_retriever/EsRetrieverBuilder';

describe('BtEsRequestUtil', () => {

    describe('instanceOfEsQueryDsl', () => {
        it('should return true for EsQueryDsl instances', () => {
            const term = EsQueryBuilder.termQuery('field', 'value');
            expect(BtEsRequestUtil.instanceOfEsQueryDsl(term)).toBe(true);
        });

        it('should return false for plain objects', () => {
            expect(BtEsRequestUtil.instanceOfEsQueryDsl({ foo: 'bar' })).toBe(false);
        });
    });

    describe('instanceOfEsRetriever', () => {
        it('should return true for EsRetriever instances', () => {
            const retriever = EsRetrieverBuilder.standardRetriever();
            expect(BtEsRequestUtil.instanceOfEsRetriever(retriever)).toBe(true);
        });

        it('should return false for plain objects', () => {
            expect(BtEsRequestUtil.instanceOfEsRetriever({ foo: 'bar' })).toBe(false);
        });
    });

    describe('buildQueryParam', () => {
        it('should build a simple term query', () => {
            const term = EsQueryBuilder.termQuery('status', 'active');
            const result = BtEsRequestUtil.buildQueryParam(term);

            expect(result).toEqual({
                term: {
                    status: { value: 'active' }
                }
            });
        });

        it('should build a term query with boost', () => {
            const term = EsQueryBuilder.termQuery('status', 'active', 2);
            const result = BtEsRequestUtil.buildQueryParam(term);

            expect(result).toEqual({
                term: {
                    status: { value: 'active', boost: 2 }
                }
            });
        });

        it('should build a match query', () => {
            const match = EsQueryBuilder.matchQuery('title', 'hello world');
            const result = BtEsRequestUtil.buildQueryParam(match);

            expect(result).toEqual({
                match: {
                    title: { query: 'hello world' }
                }
            });
        });

        it('should build a bool query with must clause', () => {
            const bool = EsQueryBuilder.boolQuery();
            bool.must(EsQueryBuilder.termQuery('status', 'active'));

            const result = BtEsRequestUtil.buildQueryParam(bool);

            expect(result).toEqual({
                bool: {
                    must: [
                        { term: { status: { value: 'active' } } }
                    ]
                }
            });
        });

        it('should build a bool query with multiple clauses', () => {
            const bool = EsQueryBuilder.boolQuery();
            bool.must(EsQueryBuilder.termQuery('status', 'active'));
            bool.must(EsQueryBuilder.matchQuery('title', 'test'));
            bool.should(EsQueryBuilder.termQuery('priority', 'high'));
            bool.mustNot(EsQueryBuilder.termQuery('deleted', true));

            const result = BtEsRequestUtil.buildQueryParam(bool);

            expect(result).toEqual({
                bool: {
                    must: [
                        { term: { status: { value: 'active' } } },
                        { match: { title: { query: 'test' } } }
                    ],
                    should: [
                        { term: { priority: { value: 'high' } } }
                    ],
                    must_not: [
                        { term: { deleted: { value: true } } }
                    ]
                }
            });
        });

        it('should build deeply nested queries (bool > pinned > organic > bool > term)', () => {
            const innerBool = EsQueryBuilder.boolQuery();
            innerBool.must(EsQueryBuilder.termQuery('keyword', 'kimchy'));

            const pinned = EsQueryBuilder.pinnedQuery([1, 2, 3]);
            pinned.organicQuery(innerBool);

            const outerBool = EsQueryBuilder.boolQuery();
            outerBool.must(pinned);

            const result = BtEsRequestUtil.buildQueryParam(outerBool);

            expect(result).toEqual({
                bool: {
                    must: [
                        {
                            pinned: {
                                ids: [1, 2, 3],
                                organic: {
                                    bool: {
                                        must: [
                                            { term: { keyword: { value: 'kimchy' } } }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            });
        });

        it('should build a match_phrase query with slop', () => {
            const phrase = EsQueryBuilder.matchPhraseQuery('title', 'quick fox').slop(3);
            const result = BtEsRequestUtil.buildQueryParam(phrase);

            expect(result).toEqual({
                match_phrase: {
                    title: { query: 'quick fox', slop: 3 }
                }
            });
        });

        it('should build a match_all query', () => {
            const matchAll = EsQueryBuilder.matchAllQuery();
            const result = BtEsRequestUtil.buildQueryParam(matchAll);

            expect(result).toEqual({ match_all: {} });
        });
    });

    describe('buildAggsParam', () => {
        it('should build a simple terms aggregation', () => {
            const aggs = EsAggregationBuilder.termsAggregations('status_aggs', 'status');
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                status_aggs: {
                    terms: { field: 'status' }
                }
            });
        });

        it('should build a stats aggregation', () => {
            const aggs = EsAggregationBuilder.statsAggregations('score_stats');
            aggs.field('score');
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                score_stats: {
                    stats: { field: 'score' }
                }
            });
        });

        it('should build a terms aggregation with sub-aggregations', () => {
            const parentAggs = EsAggregationBuilder.termsAggregations('channel_aggs', 'channel_id');
            const childAggs = EsAggregationBuilder.statsAggregations('score_stats');
            childAggs.field('score');
            parentAggs.subAggregations(childAggs);

            const result = BtEsRequestUtil.buildAggsParam(parentAggs);

            expect(result).toEqual({
                channel_aggs: {
                    terms: { field: 'channel_id' },
                    aggregations: {
                        score_stats: {
                            stats: { field: 'score' }
                        }
                    }
                }
            });
        });

        it('should build nested sub-aggregations (3 levels)', () => {
            const level1 = EsAggregationBuilder.termsAggregations('level1', 'field1');
            const level2 = EsAggregationBuilder.termsAggregations('level2', 'field2');
            const level3 = EsAggregationBuilder.sumAggregations('level3', 'amount');
            level2.subAggregations(level3);
            level1.subAggregations(level2);

            const result = BtEsRequestUtil.buildAggsParam(level1);

            expect(result).toEqual({
                level1: {
                    terms: { field: 'field1' },
                    aggregations: {
                        level2: {
                            terms: { field: 'field2' },
                            aggregations: {
                                level3: {
                                    sum: { field: 'amount' }
                                }
                            }
                        }
                    }
                }
            });
        });
    });

    describe('buildSuggestParam', () => {
        it('should build a simple suggest param (same structure as aggs)', () => {
            const suggest = EsAggregationBuilder.termsAggregations('my_suggest', 'title');
            const result = BtEsRequestUtil.buildSuggestParam(suggest);

            expect(result).toEqual({
                my_suggest: {
                    terms: { field: 'title' }
                }
            });
        });
    });

    describe('buildRetrieverParam', () => {
        it('should build a standard retriever with a query', () => {
            const query = EsQueryBuilder.matchQuery('title', 'search text');
            const retriever = EsRetrieverBuilder.standardRetriever(query);

            const result = BtEsRequestUtil.buildRetrieverParam(retriever);

            expect(result).toEqual({
                standard: {
                    query: {
                        match: {
                            title: { query: 'search text' }
                        }
                    }
                }
            });
        });

        it('should build an RRF retriever with nested standard retrievers', () => {
            const retriever1 = EsRetrieverBuilder.standardRetriever(
                EsQueryBuilder.matchQuery('title', 'text1')
            );
            const retriever2 = EsRetrieverBuilder.standardRetriever(
                EsQueryBuilder.matchQuery('content', 'text2')
            );
            const rrf = EsRetrieverBuilder.rrfRetriever([retriever1, retriever2], 100, 60);

            const result = BtEsRequestUtil.buildRetrieverParam(rrf);

            expect(result).toEqual({
                rrf: {
                    retrievers: [
                        {
                            standard: {
                                query: {
                                    match: { title: { query: 'text1' } }
                                }
                            }
                        },
                        {
                            standard: {
                                query: {
                                    match: { content: { query: 'text2' } }
                                }
                            }
                        }
                    ],
                    rank_window_size: 100,
                    rank_constant: 60
                }
            });
        });

        it('should build a standard retriever with a nested bool query', () => {
            const bool = EsQueryBuilder.boolQuery();
            bool.must(EsQueryBuilder.termQuery('status', 'published'));
            bool.must(EsQueryBuilder.matchQuery('title', 'elasticsearch'));

            const retriever = EsRetrieverBuilder.standardRetriever(bool);
            const result = BtEsRequestUtil.buildRetrieverParam(retriever);

            expect(result).toEqual({
                standard: {
                    query: {
                        bool: {
                            must: [
                                { term: { status: { value: 'published' } } },
                                { match: { title: { query: 'elasticsearch' } } }
                            ]
                        }
                    }
                }
            });
        });
    });
});
