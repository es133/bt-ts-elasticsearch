'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsTextExpansionQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string, modelId: string, modelText: string) {
        super('text_expansion');
        this.fieldName = field;
        this.setFieldProperty(field, 'model_id', modelId);
        this.setFieldProperty(field, 'model_text', modelText);
    }

    public modelId(modelId: string): EsTextExpansionQuery {
        this.setFieldProperty(this.fieldName, 'model_id', modelId);
        return this;
    }

    public modelText(modelText: string): EsTextExpansionQuery {
        this.setFieldProperty(this.fieldName, 'model_text', modelText);
        return this;
    }

    public pruningConfig(config: any): EsTextExpansionQuery {
        this.setFieldProperty(this.fieldName, 'pruning_config', config);
        return this;
    }

    public boost(value: number): EsTextExpansionQuery {
        this.setProperty('boost', value);
        return this;
    }
}
