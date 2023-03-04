'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "../es_query_dsl/EsAbstractQueryDsl";

export class EsScoreFunctionRandom extends EsAbstractQueryDsl {
    constructor(seed?:number, field?:string) {
        super('random_score');

        if (seed) {
            this.setProperty('seed', seed);
        }

        if (field) {
            this.setProperty('field', field);
        }
    }

    public seed(seed:number): EsScoreFunctionRandom {
        this.setProperty('seed', seed);
        return this;
    }

    public field(field:string): EsScoreFunctionRandom {
        this.setProperty('field', field);
        return this;
    }

}
