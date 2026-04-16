import { EsAggregationBuilder } from '../src/es_search_option/aggs/EsAggregationBuilder';
import { BtEsRequestUtil } from '../src/bt_es_request/BtEsRequestUtil';

describe('EsAggregationBuilder', () => {

    describe('termsAggregations', () => {
        it('should build a terms aggregation with field', () => {
            const aggs = EsAggregationBuilder.termsAggregations('category_aggs', 'category');
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                category_aggs: {
                    terms: { field: 'category' }
                }
            });
        });

        it('should support size and order', () => {
            const aggs = EsAggregationBuilder.termsAggregations('category_aggs', 'category');
            aggs.size(20);
            aggs.order({ _count: 'desc' });
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result.category_aggs.terms.size).toBe(20);
            expect(result.category_aggs.terms.order).toEqual({ _count: 'desc' });
        });
    });

    describe('statsAggregations', () => {
        it('should build a stats aggregation', () => {
            const aggs = EsAggregationBuilder.statsAggregations('price_stats');
            aggs.field('price');
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                price_stats: {
                    stats: { field: 'price' }
                }
            });
        });
    });

    describe('dateHistogramAggregations', () => {
        it('should build a date_histogram with interval and format', () => {
            const aggs = EsAggregationBuilder.dateHistogramAggregations('date_aggs', 'created_at');
            aggs.interval('day', 'yyyy-MM-dd');
            aggs.extendedBounds(-30, 0);
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                date_aggs: {
                    date_histogram: {
                        field: 'created_at',
                        interval: 'day',
                        format: 'yyyy-MM-dd',
                        extended_bounds: { min: -30, max: 0 }
                    }
                }
            });
        });
    });

    describe('movingFunctionAggregations', () => {
        it('should build a moving_fn aggregation', () => {
            const aggs = EsAggregationBuilder.movingFunctionAggregations('mv_sum', 'score_sum');
            aggs.window(30);
            aggs.shift(1);
            aggs.script({ source: 'return MovingFunctions.sum(values)' });
            const result = BtEsRequestUtil.buildAggsParam(aggs);

            expect(result).toEqual({
                mv_sum: {
                    moving_fn: {
                        buckets_path: 'score_sum',
                        window: 30,
                        shift: 1,
                        script: { source: 'return MovingFunctions.sum(values)' }
                    }
                }
            });
        });
    });

    describe('sub-aggregations', () => {
        it('should build parent-child aggregation', () => {
            const parent = EsAggregationBuilder.termsAggregations('channel_aggs', 'channel_id');
            const child = EsAggregationBuilder.avgAggregations('avg_score', 'score');
            parent.subAggregations(child);

            const result = BtEsRequestUtil.buildAggsParam(parent);

            expect(result).toEqual({
                channel_aggs: {
                    terms: { field: 'channel_id' },
                    aggregations: {
                        avg_score: {
                            avg: { field: 'score' }
                        }
                    }
                }
            });
        });

        it('should build multiple sibling sub-aggregations', () => {
            const parent = EsAggregationBuilder.termsAggregations('group_aggs', 'group_id');
            parent.subAggregations(EsAggregationBuilder.sumAggregations('total_amount', 'amount'));
            parent.subAggregations(EsAggregationBuilder.avgAggregations('avg_amount', 'amount'));

            const result = BtEsRequestUtil.buildAggsParam(parent);

            expect(result.group_aggs.aggregations).toHaveProperty('total_amount');
            expect(result.group_aggs.aggregations).toHaveProperty('avg_amount');
            expect(result.group_aggs.aggregations.total_amount).toEqual({ sum: { field: 'amount' } });
            expect(result.group_aggs.aggregations.avg_amount).toEqual({ avg: { field: 'amount' } });
        });

        it('should build 3-level nested aggregations', () => {
            const l1 = EsAggregationBuilder.termsAggregations('l1', 'region');
            const l2 = EsAggregationBuilder.termsAggregations('l2', 'city');
            const l3 = EsAggregationBuilder.sumAggregations('l3', 'revenue');
            l2.subAggregations(l3);
            l1.subAggregations(l2);

            const result = BtEsRequestUtil.buildAggsParam(l1);

            expect(result.l1.aggregations.l2.aggregations.l3).toEqual({
                sum: { field: 'revenue' }
            });
        });
    });
});
