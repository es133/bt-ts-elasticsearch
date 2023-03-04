'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsStatsAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'stats', field);
    }
}
