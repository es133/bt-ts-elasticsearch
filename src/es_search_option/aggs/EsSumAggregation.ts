'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsSumAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'sum', field);
    }
}
