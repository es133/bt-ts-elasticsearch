'use strict';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsMovingFunctionAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'moving_fn', path);
    }

    public shift(position:number): EsMovingFunctionAggregation {
        this.setAggsProperty('shift', position);
        return this;
    }

    public window(size:number): EsMovingFunctionAggregation {
        this.setAggsProperty('window', size);
        return this;
    }

    public script(script:any): EsMovingFunctionAggregation {
        this.setAggsProperty('script', script);
        return this;
    }
}
