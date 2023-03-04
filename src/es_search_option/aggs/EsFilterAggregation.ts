'use strict';

import {EsAbstractQueryDsl} from "../../es_query_dsl/EsAbstractQueryDsl";
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsFilterAggregation extends EsAbstractQueryDsl {
    constructor(name:string, filter?:EsQueryDsl) {
        super(name);
        if (filter) {
            this.setProperty('filter', filter);
        }

    }

    public filter(filter:EsQueryDsl): EsFilterAggregation {
        this.setProperty('filter', filter);
        return this;
    }

}
