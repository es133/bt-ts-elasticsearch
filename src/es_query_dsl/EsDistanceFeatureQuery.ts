'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {EsQueryDsl} from "../interface/EsQueryDsl";
import {EsDisMaxQuery} from "./EsDisMaxQuery";

export class EsDistanceFeatureQuery extends EsAbstractQueryDsl {

    constructor(field?:string, origin?: string | [number, number], pivot?:string) {
        super('distance_feature');

        if (field) {
            this.setProperty('field', field);
        }
        if (origin) {
            this.setProperty('origin', origin);
        }
        if (pivot) {
            this.setProperty('pivot', pivot);
        }
    }

    public field(fieldName: string):EsDistanceFeatureQuery {
        this.setProperty('field', fieldName);
        return this;
    }

    public origin(value: string | [number, number]):EsDistanceFeatureQuery {
        this.setProperty('origin', value);
        return this;
    }

    public pivot(value: string):EsDistanceFeatureQuery {
        this.setProperty('pivot', value);
        return this;
    }

    public boost(value: number):EsDistanceFeatureQuery {
        this.setProperty('boost', value);
        return this;
    }
}
