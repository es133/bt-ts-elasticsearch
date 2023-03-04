'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsMatchAllQuery extends EsAbstractQueryDsl {
    constructor() {
        super('match_all');
    }
}
