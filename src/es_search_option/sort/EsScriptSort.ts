'use strict';

import {EsAbstractQueryDsl} from "../../es_query_dsl/EsAbstractQueryDsl";
import {BT_ES_SORT_ORDER} from "../../type/BtEsEnums";

export class EsScriptSort extends EsAbstractQueryDsl {
    constructor(script?:any) {
        super('_script');
        if (script) {
            this.setProperty('script', script);
        }
    }

    public script(script:any): EsScriptSort {
        this.setProperty('script', script);
        return this;
    }

    public type(type:string): EsScriptSort {
        this.setProperty('type', type);
        return this;
    }

    public order(order:BT_ES_SORT_ORDER): EsScriptSort {
        this.setProperty('order', order);
        return this;
    }

}
