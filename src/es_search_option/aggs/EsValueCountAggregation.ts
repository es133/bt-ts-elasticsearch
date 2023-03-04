'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsValueCountAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'value_count');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsValueCountAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public script(script:any): EsValueCountAggregation {
        this.setAggsProperty('script', script);
        return this;
    }
}
