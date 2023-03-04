'use strict';

import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsTopHitsAggregation extends EsAbstractAggregation {
    constructor(name:string, sort?:any) {
        super(name, 'top_hits');
        if (sort) {
            this.setAggsProperty('sort', sort);
        }
    }

    public addSort(sort:any): EsTopHitsAggregation {
        this.addAggsProperty('sort', sort);
        return this;
    }

    public from (from:number): EsTopHitsAggregation {
        this.setAggsProperty('from', from);
        return this;
    }

    public size (size:number): EsTopHitsAggregation {
        this.setAggsProperty('size', size);
        return this;
    }

    public addSource(source:string|Array<string>): EsTopHitsAggregation {

        if(!this.aggsBody[this.aggsName][this.aggsType]['_source']) {
            this.aggsBody[this.aggsName][this.aggsType]['_source'] = {};
            this.aggsBody[this.aggsName][this.aggsType]['_source']['_includes'] = [] ;
        }
        if (Array.isArray(source)) {
            this.aggsBody[this.aggsName][this.aggsType]['_source']['_includes'].push(...source);
        } else {
            this.aggsBody[this.aggsName][this.aggsType]['_source']['_includes'].push(source);
        }
        return this;
    }

}
