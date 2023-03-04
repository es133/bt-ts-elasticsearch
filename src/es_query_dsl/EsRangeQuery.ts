'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsRangeQuery extends EsAbstractQueryDsl {
    protected fieldName: string;
    constructor(field:string, from?: number|string, to?:number|string) {
        super('range');
        this.fieldName= field;
        if (from) {
            this.setFieldProperty(this.fieldName, 'from', from);
        }
        if (to) {
            this.setFieldProperty(this.fieldName, 'to', to);
        }
    }

    public boost(value:number): EsRangeQuery {
        this.setFieldProperty(this.fieldName,'boost',value);
        return this;
    }

    public from(from:number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName,'from', from);
        return this;
    }

    public to(to: number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName, 'to', to);
        return this;
    }

    public gte(gte: number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName, 'gte', gte);
        return this;
    }

    public lte(lte: number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName, 'lte', lte);
        return this;
    }

    public gt(gt: number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName, 'gt', gt);
        return this;
    }

    public lt(lt: number|string): EsRangeQuery {
        this.setFieldProperty(this.fieldName, 'lt', lt);
        return this;
    }

}
