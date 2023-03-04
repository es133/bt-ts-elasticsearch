'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsRangeAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'range');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsRangeAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public addTo(value:string|number): EsRangeAggregation {
        this.addAggsProperty('ranges', {to :value});
        return this;
    }

    public addFrom(value:string|number): EsRangeAggregation {
        this.addAggsProperty('ranges', {from: value});
        return this;
    }
}
