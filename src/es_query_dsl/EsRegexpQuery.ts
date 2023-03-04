'use strict';

import {EsQueryDsl} from "../interface/EsQueryDsl";
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsRegexpQuery extends EsAbstractQueryDsl {

    protected fieldName: string;

    constructor(field:string, value?:any) {
        super('regexp');
        this.fieldName = field;

        if (value) {
            //this.dslBody[this.fieldNameName].set('value', value);
            //const valueObj = { value:value };
            this.setFieldProperty(this.fieldName, 'value', value);
        }
    }

    public value(value:any):EsRegexpQuery {
        this.setFieldProperty(this.fieldName, 'value', value);
        return this;
    }

    public flags(flags: string): EsRegexpQuery {
        this.setFieldProperty(this.fieldName, 'flags', flags);
        return this;
    }

    public maxDeterminizedStates(statesNum: number): EsRegexpQuery {
        this.setFieldProperty(this.fieldName, 'max_determinized_states', statesNum);
        return this;
    }

    public caseInsensitive(value: boolean): EsRegexpQuery {
        this.setFieldProperty(this.fieldName, 'case_insensitive', value);
        return this;
    }
}
