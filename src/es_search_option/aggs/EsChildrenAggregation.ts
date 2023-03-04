'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsChildrenAggregation extends EsAbstractAggregation {
    constructor(name:string) {
        super(name, 'children');
    }

    public children(type:string): EsChildrenAggregation {
        this.setAggsProperty('type', type);
        return this;
    }
}
