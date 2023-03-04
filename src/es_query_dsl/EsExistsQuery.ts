'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsExistsQuery extends EsAbstractQueryDsl {
    constructor(fieldName:string) {
        super('exists');
        this.setProperty('field', fieldName);
    }
}
