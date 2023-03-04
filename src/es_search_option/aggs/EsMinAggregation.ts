'use strict';
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsMinAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'min', field);
    }
}
