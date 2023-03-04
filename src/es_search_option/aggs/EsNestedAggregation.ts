'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsNestedAggregation extends EsAbstractAggregation {
    constructor(name:string, path?:string) {
        super(name, 'nested');
        if (path) {
            this.setAggsProperty('path', path);
        }
    }

    public path(path:string): EsNestedAggregation {
        this.setAggsProperty('path', path);
        return this;
    }

}
