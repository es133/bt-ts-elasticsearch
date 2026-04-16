import { BtEsAbstractSearchRequest } from '../src/bt_es_request/BtEsAbstractSearchRequest';
import { EsQueryBuilder } from '../src/es_query_dsl/EsQueryBuilder';
import { EsAggregationBuilder } from '../src/es_search_option/aggs/EsAggregationBuilder';
import { EsSearchOptionBuilder } from '../src/es_search_option/EsSearchOptionBuilder';
import { EsRetrieverBuilder } from '../src/es_retriever/EsRetrieverBuilder';

describe('BtEsAbstractSearchRequest', () => {

    describe('getParam with query DSL', () => {
        it('should build a search request with a simple query', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());

            const param = request.getParam();

            expect(param.body.query).toEqual({ match_all: {} });
            expect(param.search_type).toBe('query_then_fetch');
            expect(param._source).toBe(false);
            expect(param.track_total_hits).toBe(true);
        });

        it('should build a search request with bool query', () => {
            const request = new BtEsAbstractSearchRequest();
            const bool = EsQueryBuilder.boolQuery();
            bool.must(EsQueryBuilder.termQuery('status', 'active'));
            bool.must(EsQueryBuilder.matchQuery('title', 'test'));
            request.setQueryDsl(bool);

            const param = request.getParam();

            expect(param.body.query.bool.must).toHaveLength(2);
            expect(param.body.query.bool.must[0]).toEqual({
                term: { status: { value: 'active' } }
            });
            expect(param.body.query.bool.must[1]).toEqual({
                match: { title: { query: 'test' } }
            });
        });
    });

    describe('size and from', () => {
        it('should set size and from', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());
            request.setSize(20);
            request.setFrom(40);

            const param = request.getParam();

            expect(param.size).toBe(20);
            expect(param.from).toBe(40);
        });

        it('should support property accessors', () => {
            const request = new BtEsAbstractSearchRequest();
            request.size = 10;
            request.from = 0;

            expect(request.size).toBe(10);
            expect(request.from).toBe(0);
        });
    });

    describe('aggregations', () => {
        it('should add aggregations to the request', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());

            const aggs = EsAggregationBuilder.termsAggregations('status_aggs', 'status');
            request.addAggregations(aggs);

            const param = request.getParam();

            expect(param.body.aggregations).toEqual({
                status_aggs: {
                    terms: { field: 'status' }
                }
            });
        });

        it('should merge multiple aggregations', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());

            request.addAggregations(EsAggregationBuilder.termsAggregations('aggs1', 'field1'));
            request.addAggregations(EsAggregationBuilder.statsAggregations('aggs2'));

            const param = request.getParam();

            expect(param.body.aggregations).toHaveProperty('aggs1');
            expect(param.body.aggregations).toHaveProperty('aggs2');
        });
    });

    describe('highlight', () => {
        it('should add highlight to the request', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());

            const highlight = EsSearchOptionBuilder.highlight(['title', 'content']);
            highlight.preTags('<em>');
            highlight.postTags('</em>');
            request.addHighlight(highlight);

            const param = request.getParam();

            expect(param.body.highlight).toBeDefined();
            expect(param.body.highlight.fields).toHaveProperty('title');
            expect(param.body.highlight.fields).toHaveProperty('content');
            expect(param.body.highlight.pre_tags).toBe('<em>');
            expect(param.body.highlight.post_tags).toBe('</em>');
        });
    });

    describe('sort', () => {
        it('should add sort to the request', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());
            request.addSort(EsSearchOptionBuilder.sort('created_at', 'desc' as any));

            const param = request.getParam();

            expect(param.body.sort).toBeDefined();
            expect(param.body.sort).toBeInstanceOf(Array);
            expect(param.body.sort).toHaveLength(1);
        });
    });

    describe('scroll', () => {
        it('should set scroll parameter', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setQueryDsl(EsQueryBuilder.matchAllQuery());
            request.setScroll('5m');

            const param = request.getParam();

            expect(param.scroll).toBe('5m');
        });
    });

    describe('retriever', () => {
        it('should build a request with a retriever instead of query', () => {
            const request = new BtEsAbstractSearchRequest();
            const retriever = EsRetrieverBuilder.standardRetriever(
                EsQueryBuilder.matchQuery('title', 'test')
            );
            request.setRetriever(retriever);

            const param = request.getParam();

            expect(param.body.query).toBeUndefined();
            expect(param.body.retriever).toEqual({
                standard: {
                    query: {
                        match: { title: { query: 'test' } }
                    }
                }
            });
        });
    });

    describe('searchAfter and pit', () => {
        it('should set searchAfter value', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setSearchAfter('sort_value_123');

            expect(request.getSearchAfter()).toEqual(['sort_value_123']);
        });

        it('should set pit', () => {
            const request = new BtEsAbstractSearchRequest();
            request.setPit('pit_id_123', '5m');

            expect(request.getPit()).toEqual({
                id: 'pit_id_123',
                keep_alive: '5m'
            });
        });
    });
});
