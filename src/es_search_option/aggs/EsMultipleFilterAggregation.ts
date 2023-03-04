'use strict';

import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsAbstractAggregation} from "./EsAbstractAggregation";

export class EsMultipleFilterAggregation extends EsAbstractAggregation {
    constructor(name:string, filter?:EsQueryDsl) {
        super(name, 'filters');
        if (filter) {
            this.addAggsProperty('filters', filter);
        }
    }

    public addFilter(filter:EsQueryDsl): EsMultipleFilterAggregation {
        this.addAggsProperty('filters', filter);
        return this;
    }

}
