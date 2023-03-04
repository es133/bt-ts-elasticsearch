'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsTermsAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'terms');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsTermsAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public size(size:number): EsTermsAggregation {
        this.setAggsProperty('size', size);
        return this;
    }

    public order(order:any): EsTermsAggregation {
        this.setAggsProperty('order', order);
        return this;
    }

    public minDocCount(count:number): EsTermsAggregation {
        this.setAggsProperty('min_doc_count', count);
        return this;
    }

    public script(script:any): EsTermsAggregation {
        this.setAggsProperty('script', script);
        return this;
    }

    public valueType(type:string): EsTermsAggregation {
        this.setAggsProperty('value_type', type);
        return this;
    }

    public missingValue(value:number|string): EsTermsAggregation {
        this.setAggsProperty('missing', value);
        return this;
    }

    public addValueFilterInclude(include:string): EsTermsAggregation {
        this.addAggsProperty('include', include);
        return this;
    }

    public addValueFilterExclude(exclude:string): EsTermsAggregation {
        this.addAggsProperty('exclude', exclude);
        return this;
    }


}
