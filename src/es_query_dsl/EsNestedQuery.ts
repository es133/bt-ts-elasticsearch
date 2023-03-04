'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_RELEVANCE_SCORE_MODE, BT_ES_SCORE_CALC_MODE} from "../type/BtEsEnums";

export class EsNestedQuery extends EsAbstractQueryDsl {
    constructor(path:string, subQuery?:EsQueryDsl) {
        super('nested');
        this.setProperty('path', path);
        if (subQuery) {
            this.setProperty('query', subQuery);
        }
    }

    public query(subQuery:EsNestedQuery): EsNestedQuery {
        this.setProperty('query', subQuery);
        return this;
    }

    public scoreMode(scoreMode:BT_ES_RELEVANCE_SCORE_MODE): EsNestedQuery {
        this.setProperty('score_mode', scoreMode);
        return this;
    }

    public path(path:string): EsNestedQuery {
        this.setProperty('path', path);
        return this;
    }

    public ignoreUnmapped(flag:boolean): EsNestedQuery {
        this.setProperty('ignore_unmapped', flag);
        return this;
    }


    public innerHits(innerHits: EsQueryDsl): EsNestedQuery {
        this.setProperty('inner_hits', innerHits);
        return this;
    }
}
