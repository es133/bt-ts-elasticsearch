'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsHasParentQuery extends EsAbstractQueryDsl {
    protected relationType:string;
    constructor(parentType:string, subQuery?:EsQueryDsl) {
        super('has_parent');
        this.relationType = parentType;
        if (subQuery) {
            this.setProperty('query', subQuery);
        }
    }

    public query(subQuery:EsQueryDsl):EsHasParentQuery {
        this.setProperty('query', subQuery);
        return this;
    }

    public score(value:boolean):EsHasParentQuery {
        this.setProperty('score', value);
        return this;
    }

    public ignoreUnmapped(value:boolean):EsHasParentQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

}
