'use strict';
import { BtEsRequestUtil} from '../../bt_es_request/BtEsRequestUtil'
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsBucketSortAggregation extends EsAbstractAggregation {
    constructor (name:string) {
        super(name, 'bucket_sort');
    }

    public addSort(sort:EsQueryDsl): EsBucketSortAggregation {
        this.addAggsProperty('sort', BtEsRequestUtil.buildQueryParam(sort));
        return this;
    }

    public from(from:string): EsBucketSortAggregation {
        this.setAggsProperty('from', from);
        return this;
    }

    public size(size:number): EsBucketSortAggregation {
        this.setAggsProperty('size', size);
        return this;
    }

    public gapPolicy(policy:string): EsBucketSortAggregation {
        //skip:default
        //insert_zeros
        this.setAggsProperty('gap_policy', policy);
        return this;
    }

}

module.exports = EsBucketSortAggregation;