'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsRankFeatureQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string) {
        super('rank_feature');
        this.fieldName = field;
        this.setProperty('field', field);
    }

    public field(field: string): EsRankFeatureQuery {
        this.fieldName = field;
        this.setProperty('field', field);
        return this;
    }

    public saturation(pivot?: number): EsRankFeatureQuery {
        const saturationObj: any = {};
        if (pivot !== undefined) saturationObj.pivot = pivot;
        this.setProperty('saturation', saturationObj);
        return this;
    }

    public log(scalingFactor: number): EsRankFeatureQuery {
        this.setProperty('log', { scaling_factor: scalingFactor });
        return this;
    }

    public sigmoid(pivot: number, exponent: number): EsRankFeatureQuery {
        this.setProperty('sigmoid', { pivot, exponent });
        return this;
    }

    public linear(): EsRankFeatureQuery {
        this.setProperty('linear', {});
        return this;
    }

    public boost(value: number): EsRankFeatureQuery {
        this.setProperty('boost', value);
        return this;
    }
}
