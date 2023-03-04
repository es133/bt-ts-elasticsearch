'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsMetricAbstractAggregation extends EsAbstractAggregation {
    constructor(name:string, type:string, field?:string) {
        super(name, type);
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsMetricAbstractAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public script(script:any): EsMetricAbstractAggregation {
        this.setAggsProperty('script', script)
        return this;
    }

    public missingValue(value:number|string): EsMetricAbstractAggregation {
        this.setAggsProperty('missing', value);
        return this;
    }
}
