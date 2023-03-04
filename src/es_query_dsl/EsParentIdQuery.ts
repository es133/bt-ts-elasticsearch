'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsParentIdQuery extends EsAbstractQueryDsl {
    constructor(relationName?:string, parentDocId?:string) {
        super('parent_id');
        if (relationName) {
            this.setProperty('type', relationName);
        }
        if (parentDocId) {
            this.setProperty('id', parentDocId);
        }
    }

    public parentId(parentDocId:string):EsParentIdQuery {
        this.setProperty('id', parentDocId);
        return this;
    }

    public childType(relationName:string): EsParentIdQuery {
        this.setProperty('type', relationName);
        return this;
    }

    public ignoreUnmapped(value:boolean):EsParentIdQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }
}
