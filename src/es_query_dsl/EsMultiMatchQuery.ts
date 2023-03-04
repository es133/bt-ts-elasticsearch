'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_MULTIMATCH_TYPE, BT_ES_QUERY_LOGIC_OPERATOR} from "../type/BtEsEnums";

export class EsMultiMatchQuery extends EsAbstractQueryDsl {

    constructor(queryString?:string, fields?:string|Array<string>) {
        super('multi_match');
        if (queryString) {
            this.setProperty('query', queryString);
        }
        if (fields) {
            this.setProperty('fields', fields);
        }
    }

    public query(queryString: string):EsMultiMatchQuery {
        this.setProperty('query', queryString);
        return this;
    }

    public fields(fields:string|Array<string>): EsMultiMatchQuery {
        this.setProperty('fields', fields);
        return this;
    }

    public queryType(type:BT_ES_MULTIMATCH_TYPE):EsMultiMatchQuery {
        this.setProperty('type', type);
        return this;
    }

    public operator(operator:BT_ES_QUERY_LOGIC_OPERATOR):EsMultiMatchQuery {
        this.setProperty('operator', operator);
        return this;
    }

    public tieBreaker(value:number): EsMultiMatchQuery {
        this.setProperty('tie_breaker', value);
        return this;
    }

    public boost(value:number): EsMultiMatchQuery {
        this.setProperty('boost', value);
        return this;
    }
}
