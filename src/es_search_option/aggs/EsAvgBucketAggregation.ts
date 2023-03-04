'use strict';
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsAvgBucketAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'avg_bucket', path);
    }

    public format(decimalFormat:string): EsAvgBucketAggregation {
        this.setAggsProperty('format', decimalFormat);
        return this;
    }
}
