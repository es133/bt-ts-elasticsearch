'use strict';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsMetricAbstractAggregation} from "./EsMetricAbstractAggregation";

export class EsCardinalityAggregation extends EsMetricAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'cardinality', field);
    }

    public precisionThreshold(value:number): EsCardinalityAggregation {
        this.setAggsProperty('precision_threshold', value);
        return this;
    }
}
