'use strict';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsBucketSelectorAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'bucket_selector', path);
    }

    public script(script:any):EsBucketSelectorAggregation {
        this.setAggsProperty('script', script);
        return this;
    }
}
