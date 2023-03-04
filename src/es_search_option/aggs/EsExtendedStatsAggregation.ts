'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsExtendedStatsAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?: string) {
        super(name, 'extended_stats', field);
    }

}
