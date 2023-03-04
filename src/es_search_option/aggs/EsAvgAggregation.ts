'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsAvgAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'avg', field);
    }
}
