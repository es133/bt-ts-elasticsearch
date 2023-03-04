'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsPinnedQuery extends EsAbstractQueryDsl {
    constructor(idList?:Array<number|string>, organicQuery?:EsQueryDsl ){
        super('pinned');
        //console.log(this._body);
        if (idList) {
            this.addProperty('ids', idList);
        }
        if (organicQuery) {
            this.setProperty('organic', organicQuery);
        }
    }

    public idList(idList:Array<number|string>): EsPinnedQuery{
        this.addProperty('ids', idList);
        return this;
    }

    public organicQuery(query:EsQueryDsl): EsPinnedQuery {
        this.setProperty('organic', query);
        return this;
    }
}
