'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {EsQueryDsl} from "../interface/EsQueryDsl";

export class EsConstantScoreQuery extends EsAbstractQueryDsl {
    constructor(filter?: EsQueryDsl, boostValue?:number) {
        super('constant_score');
        if (filter) {
            this.setProperty('filter', filter);
        }
        if (boostValue) {
            this.setProperty('boost', boostValue);
        }
    }

    public filter(filter: EsQueryDsl): EsConstantScoreQuery {
        this.setProperty('filter', filter);
        return this;
    }

    public boost(boostValue:number): EsConstantScoreQuery {
        this.setProperty('boost', boostValue);
        return this;
    }

}
