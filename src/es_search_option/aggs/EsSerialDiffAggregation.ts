'use strict';
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsSerialDiffAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'serial_diff', path);
    }

    public lag(lagNum:number): EsSerialDiffAggregation {
        this.setAggsProperty('lag', lagNum);
        return this;
    }

    public format(format:string): EsSerialDiffAggregation {
        this.setAggsProperty('format', format);
        return this;
    }
}
