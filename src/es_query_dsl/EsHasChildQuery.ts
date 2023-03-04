'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_RELEVANCE_SCORE_MODE} from "../type/BtEsEnums";

export class EsHasChildQuery extends EsAbstractQueryDsl {
    protected relationType: string;
    constructor(type:string, subQuery?:EsQueryDsl) {
        super('has_child');
        this.relationType = type;
        if (subQuery) {
            this.setProperty('query', subQuery);
        }
    }

    public query(subQuery:EsQueryDsl):EsHasChildQuery {
        this.setProperty('query', subQuery);
        return this;
    }

    public scoreMode(scoreMode:BT_ES_RELEVANCE_SCORE_MODE):EsHasChildQuery {
        this.setProperty('score_mode', scoreMode);
        return this;
    }

    public type(type:string):EsHasChildQuery {
        this.setProperty('type', type);
        return this;
    }

    public minChildren(num:number):EsHasChildQuery {
        this.setProperty('min_children', num);
        return this;
    }

    public maxChildren(num:number):EsHasChildQuery {
        this.setProperty('max_children', num);
        return this;
    }

    public ignoreUnmapped(value:boolean):EsHasChildQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

}
