'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "../es_query_dsl/EsAbstractQueryDsl";

export class EsScoreFunctionFieldValueFactor extends EsAbstractQueryDsl {
    constructor(field?:string, factor?:number, modifier?:string, missing?:number|string) {
        super('field_value_factor');

        if (field) {
            this.setProperty('field', field);
        }
        if (factor) {
            this.setProperty('factor', factor);
        }
        if (modifier) {
            this.setProperty('modifier', modifier);
        }
        if (missing) {
            this.setProperty('missing', missing);
        }
    }

    public field(field:string): EsScoreFunctionFieldValueFactor {
        this.setProperty('field', field);
        return this;
    }

    public factor(factor:number): EsScoreFunctionFieldValueFactor {
        this.setProperty('factor', factor);
        return this;
    }

    public modifier(modifier:string): EsScoreFunctionFieldValueFactor {
        this.setProperty('modifier', modifier);
        return this;
    }

    public missing(missing:number|string): EsScoreFunctionFieldValueFactor {
        this.setProperty('missing', missing);
        return this;
    }
}
