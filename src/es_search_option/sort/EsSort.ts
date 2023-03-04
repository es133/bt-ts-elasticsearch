'use strict';
import {EsAbstractQueryDsl} from "../../es_query_dsl/EsAbstractQueryDsl";
import {BT_ES_SORT_ORDER} from "../../type/BtEsEnums";

export class EsSort extends EsAbstractQueryDsl {
    constructor(field:string, order?:BT_ES_SORT_ORDER, mode?:string) {
        super(field);
        if (order) {
            this.setProperty('order', order);
        }
        if (mode) {
            this.setProperty('mode', mode);
        }
    }

    public order(order:BT_ES_SORT_ORDER): EsSort {
        this.setProperty('order', order);
        return this;
    }

    public mode(mode:string): EsSort {
        this.setProperty('mode', mode);
        return this;
    }

    public missing(value:number|string): EsSort {
        this.setProperty('missing', value);
        return this;
    }
}
