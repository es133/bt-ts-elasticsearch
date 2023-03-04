'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsDisMaxQuery extends EsAbstractQueryDsl {
    constructor(queries?:Array<EsQueryDsl>) {
        super('dis_max');
        if (queries) {
            this.setProperty('queries', queries);
        }
    }

    public add(subQueryDsl: EsQueryDsl):EsDisMaxQuery {

        if (this.hasProperty('queries')) {
            this.addProperty('queries', subQueryDsl);
        } else {
            this.setProperty('queries', [subQueryDsl]);
        }
        return this;
    }

    public boost(boostValue: number):EsDisMaxQuery {
        this.setProperty('boost', boostValue);
        return this;
    }

    public tieBreaker(value:number):EsDisMaxQuery {
        this.setProperty('tie_breaker', value);
        return this;
    }
}
