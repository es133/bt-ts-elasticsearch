'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "../es_query_dsl/EsAbstractQueryDsl";

export class EsScoreFunctionScript extends EsAbstractQueryDsl {
    constructor(script?:any) {
        super('script_score');

        if (script) {
            this.setProperty('script', script);
        }

    }

    public script(script:any): EsScoreFunctionScript {
        this.setProperty('script', script);
        return this;
    }

}
