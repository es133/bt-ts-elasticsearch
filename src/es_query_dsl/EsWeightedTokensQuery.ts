'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsWeightedTokensQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string, tokens: Record<string, number>) {
        super('weighted_tokens');
        this.fieldName = field;
        this.setFieldProperty(field, 'tokens', tokens);
    }

    public tokens(tokens: Record<string, number>): EsWeightedTokensQuery {
        this.setFieldProperty(this.fieldName, 'tokens', tokens);
        return this;
    }

    public pruningConfig(config: any): EsWeightedTokensQuery {
        this.setFieldProperty(this.fieldName, 'pruning_config', config);
        return this;
    }

    public boost(value: number): EsWeightedTokensQuery {
        this.setProperty('boost', value);
        return this;
    }
}
