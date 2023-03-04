'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {EsQueryDsl} from "../interface/EsQueryDsl";

export class EsBoostingQuery extends EsAbstractQueryDsl {
    constructor() {
        super('boosting');
    }

    public positive(subQueryDsl: EsQueryDsl):EsBoostingQuery{
        this.setProperty('positive', subQueryDsl);
        return this;
    }

    public negative(subQueryDsl:EsQueryDsl):EsBoostingQuery{
        this.setProperty('negative', subQueryDsl);
        return this;
    }

    public negativeBoost(value:number):EsBoostingQuery{
        this.setProperty('negative_boost', value);
        return this;
    }

}
