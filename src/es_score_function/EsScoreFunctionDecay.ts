'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "../es_query_dsl/EsAbstractQueryDsl";

export class EsScoreFunctionDecay extends EsAbstractQueryDsl {
    protected fieldName: string;
    constructor(name:string, field:string, origin?:string, scale?:string, offset?:string, decay?:number, multiValueMode?:string) {
        super(name);
        this.fieldName = field;

        if (origin) {
            this.setFieldProperty(this.fieldName, 'origin', origin);
        }

        if (scale) {
            this.setFieldProperty(this.fieldName, 'scale', scale);
        }

        if (offset) {
            this.setFieldProperty(this.fieldName, 'offset', offset);
        }

        if (decay) {
            this.setFieldProperty(this.fieldName, 'decay', decay);
        }

        if (multiValueMode) {
            this.setProperty('multi_value_mode', multiValueMode);
        }

    }

    public origin(origin:string): EsScoreFunctionDecay {
        this.setFieldProperty(this.fieldName, 'origin', origin);
        return this;
    }

    public scale(scale:string): EsScoreFunctionDecay {
        this.setFieldProperty(this.fieldName, 'scale', scale);
        return this;
    }

    public offset(offset:string): EsScoreFunctionDecay {
        this.setFieldProperty(this.fieldName, 'offset', offset);
        return this;
    }

    public decay(decay:number): EsScoreFunctionDecay {
        this.setFieldProperty(this.fieldName, 'decay', decay);
        return this;
    }
    public multiValueMode(multiValueMode:string): EsScoreFunctionDecay {
        this.setProperty('multi_value_mode', multiValueMode);
        return this;
    }
}
