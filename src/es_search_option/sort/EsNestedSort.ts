'use strict';

import { EsSort} from './EsSort';
import {BT_ES_SORT_ORDER} from "../../type/BtEsEnums";
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsNestedSort extends EsSort {
    constructor(field:string, order?:BT_ES_SORT_ORDER, mode?:string) {
        super(field, order, mode);
    }

    public nestedPath(path:string): EsNestedSort {
        this.setFieldProperty('nested', 'path', path);
        return this;
    }

    public nestedFilter(filter:EsQueryDsl): EsNestedSort {
        this.setFieldProperty('nested', 'filter', filter);
        return this;
    }
}
