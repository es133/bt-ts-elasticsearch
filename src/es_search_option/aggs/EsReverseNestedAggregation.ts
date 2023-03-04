'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsReverseNestedAggregation extends EsAbstractAggregation{

    constructor(name:string, path?:string) {
        super(name, 'reverse_nested');
        if (path) {
            this.setAggsProperty('path', path);
        }
    }

    public path(path:string): EsReverseNestedAggregation {
        this.setAggsProperty('path', path);
        return this;
    }

}
