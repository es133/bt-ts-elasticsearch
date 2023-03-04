'use strict';

import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsIdsQuery extends EsAbstractQueryDsl {

    constructor(idList:Array<number|string>) {
        super('ids');
        this.setProperty('values', idList);
    }

}
