'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsMissingAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'missing');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsMissingAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

}
