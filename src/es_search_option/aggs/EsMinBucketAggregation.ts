'use strict';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsMinBucketAggregation extends EsBucketAbstractAggregation {

    constructor (name:string, path?:string) {
        super(name, 'min_bucket', path);
    }

    public format(decimalFormat:string): EsMinBucketAggregation {
        this.setAggsProperty('format', decimalFormat);
        return this;
    }
}
