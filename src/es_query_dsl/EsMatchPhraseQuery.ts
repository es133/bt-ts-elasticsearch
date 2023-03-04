'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsMatchPhraseQuery extends EsAbstractQueryDsl {

    protected fieldName:string;
    constructor(field:string, text?:string) {
        super('match_phrase');
        this.fieldName = field;
        if (text) {
            this.setFieldProperty(this.fieldName, 'query', text);
        }
    }

    public query(text: string): EsMatchPhraseQuery {
        this.setFieldProperty(this.fieldName, 'query', text);
        return this;
    }

    public boost(value:number):EsMatchPhraseQuery {
        this.setFieldProperty(this.fieldName, 'boost', value);
        return this;
    }

    public analyzer(analyzer:any):EsMatchPhraseQuery {
        this.setFieldProperty(this.fieldName, 'analyzer', analyzer);
        return this;
    }

    public slop(value: number): EsMatchPhraseQuery {
        this.setFieldProperty(this.fieldName, 'slop', value);
        return this;
    }

}
