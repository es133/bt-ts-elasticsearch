'use strict';

import { EsHighlight } from './EsHighlight';
import { EsNestedSort } from './sort/EsNestedSort';
import { EsScriptSort } from './sort/EsScriptSort';
import { EsSort } from './sort/EsSort';
import {ES_SORT_ORDER} from "../type/BtEsEnums";

export class EsSearchOptionBuilder {
    constructor() {

    }

    static highlight(fields:string | Array<string>):EsHighlight {
        return new EsHighlight(fields);
    }

    static sort(field:string, order?:ES_SORT_ORDER, mode?:string):EsSort {
        return new EsSort(field, order, mode);
    }

    static scriptSort(script:any):EsScriptSort {
        return new EsScriptSort(script);
    }

    static nestedSort(field:string, order?:ES_SORT_ORDER, mode?:string):EsNestedSort {
        return new EsNestedSort(field, order, mode);
    }
}
