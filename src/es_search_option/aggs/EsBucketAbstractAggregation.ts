'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import { EsQueryDsl } from "../../interface/EsQueryDsl";

export class EsBucketAbstractAggregation extends EsAbstractAggregation {
    constructor(name: string, type:string, path?: string) {
        super(name, type);
        if (path) {
            this.setAggsProperty('buckets_path', path);
        }
    }

    public bucketsPath(path: string): EsBucketAbstractAggregation {
        this.setAggsProperty('buckets_path', path);
        return this;
    }

    public gapPolicy(policy: string): EsBucketAbstractAggregation {
        //skip:default
        //insert_zeros
        this.setAggsProperty('gap_policy', policy);
        return this;
    }
}
