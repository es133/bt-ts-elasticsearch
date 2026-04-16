import { EsQueryBuilder } from '../src/es_query_dsl/EsQueryBuilder';
import { BtEsRequestUtil } from '../src/bt_es_request/BtEsRequestUtil';

describe('EsQueryBuilder', () => {

    describe('termQuery', () => {
        it('should create a term query with field and value', () => {
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.termQuery('status', 'active')
            );
            expect(result).toEqual({ term: { status: { value: 'active' } } });
        });

        it('should support boost', () => {
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.termQuery('status', 'active', 1.5)
            );
            expect(result).toEqual({ term: { status: { value: 'active', boost: 1.5 } } });
        });
    });

    describe('matchQuery', () => {
        it('should create a match query', () => {
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.matchQuery('title', 'elasticsearch')
            );
            expect(result).toEqual({ match: { title: { query: 'elasticsearch' } } });
        });

        it('should support chained options', () => {
            const query = EsQueryBuilder.matchQuery('title', 'test')
                .fuzziness('AUTO')
                .boost(2);
            const result = BtEsRequestUtil.buildQueryParam(query);

            expect(result.match.title.query).toBe('test');
            expect(result.match.title.fuzziness).toBe('AUTO');
            expect(result.match.title.boost).toBe(2);
        });
    });

    describe('matchPhraseQuery', () => {
        it('should create a match_phrase query with slop', () => {
            const query = EsQueryBuilder.matchPhraseQuery('description', 'quick brown fox').slop(2);
            const result = BtEsRequestUtil.buildQueryParam(query);

            expect(result).toEqual({
                match_phrase: {
                    description: { query: 'quick brown fox', slop: 2 }
                }
            });
        });
    });

    describe('matchAllQuery', () => {
        it('should create a match_all query', () => {
            const result = BtEsRequestUtil.buildQueryParam(EsQueryBuilder.matchAllQuery());
            expect(result).toEqual({ match_all: {} });
        });
    });

    describe('existsQuery', () => {
        it('should create an exists query', () => {
            const result = BtEsRequestUtil.buildQueryParam(EsQueryBuilder.existsQuery('email'));
            expect(result).toEqual({ exists: { field: 'email' } });
        });
    });

    describe('rangeQuery', () => {
        it('should create a range query with gte/lte', () => {
            const query = EsQueryBuilder.rangeQuery('age').gte(18).lte(65);
            const result = BtEsRequestUtil.buildQueryParam(query);

            expect(result).toEqual({
                range: { age: { gte: 18, lte: 65 } }
            });
        });

        it('should create a range query with from/to', () => {
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.rangeQuery('date', '2024-01-01', '2024-12-31')
            );
            expect(result).toEqual({
                range: { date: { from: '2024-01-01', to: '2024-12-31' } }
            });
        });
    });

    describe('wildcardQuery', () => {
        it('should create a wildcard query', () => {
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.wildcardQuery('name', 'ki*y', 2)
            );
            expect(result).toEqual({
                wildcard: { name: { value: 'ki*y', boost: 2 } }
            });
        });
    });

    describe('boolQuery', () => {
        it('should create an empty bool query', () => {
            const result = BtEsRequestUtil.buildQueryParam(EsQueryBuilder.boolQuery());
            expect(result).toEqual({ bool: {} });
        });

        it('should support filter clause', () => {
            const bool = EsQueryBuilder.boolQuery();
            bool.filter(EsQueryBuilder.termQuery('status', 'published'));
            const result = BtEsRequestUtil.buildQueryParam(bool);

            expect(result).toEqual({
                bool: {
                    filter: [
                        { term: { status: { value: 'published' } } }
                    ]
                }
            });
        });

        it('should support minimum_should_match', () => {
            const bool = EsQueryBuilder.boolQuery();
            bool.should(EsQueryBuilder.termQuery('tag', 'tech'));
            bool.should(EsQueryBuilder.termQuery('tag', 'science'));
            bool.minimumShouldMatch(1);
            const result = BtEsRequestUtil.buildQueryParam(bool);

            expect(result.bool.minimum_should_match).toBe(1);
            expect(result.bool.should).toHaveLength(2);
        });
    });

    describe('constantScoreQuery', () => {
        it('should wrap a filter with constant score', () => {
            const filter = EsQueryBuilder.termQuery('status', 'active');
            const result = BtEsRequestUtil.buildQueryParam(
                EsQueryBuilder.constantScoreQuery(filter, 1.2)
            );

            expect(result).toEqual({
                constant_score: {
                    filter: { term: { status: { value: 'active' } } },
                    boost: 1.2
                }
            });
        });
    });

    describe('nestedQuery', () => {
        it('should create a nested query', () => {
            const nested = EsQueryBuilder.nestedQuery(
                'comments',
                EsQueryBuilder.matchQuery('comments.text', 'hello')
            );
            const result = BtEsRequestUtil.buildQueryParam(nested);

            expect(result).toEqual({
                nested: {
                    path: 'comments',
                    query: {
                        match: { 'comments.text': { query: 'hello' } }
                    }
                }
            });
        });
    });

    describe('pinnedQuery', () => {
        it('should create a pinned query with ids and organic query', () => {
            const organic = EsQueryBuilder.matchQuery('title', 'test');
            const pinned = EsQueryBuilder.pinnedQuery([10, 20, 30], organic);
            const result = BtEsRequestUtil.buildQueryParam(pinned);

            expect(result).toEqual({
                pinned: {
                    ids: [10, 20, 30],
                    organic: {
                        match: { title: { query: 'test' } }
                    }
                }
            });
        });
    });
});
