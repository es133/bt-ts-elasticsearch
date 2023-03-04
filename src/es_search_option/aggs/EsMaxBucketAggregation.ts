'use strict';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsMaxBucketAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'max_bucket', path);
    }

    public format(decimalFormat:string): EsMaxBucketAggregation {
        this.setAggsProperty('format', decimalFormat);
        return this;
    }
}
