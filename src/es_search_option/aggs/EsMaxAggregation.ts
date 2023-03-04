'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsMaxAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'max', field);
    }
}
