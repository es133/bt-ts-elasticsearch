'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";

export class EsInnerHits extends EsAbstractQueryDsl {
    constructor(){
        super('inner_hits');
    }

    public hitsName(name:string): EsInnerHits {
        this.setProperty('name', name);
        return this;
    }

    public size(size:number): EsInnerHits {
        this.setProperty('size', size);
        return this;
    }

    public from(offset:number):EsInnerHits {
        this.setProperty('from', offset);
        return this;
    }

    public sort(sort:EsInnerHits):EsInnerHits {
        this.setProperty('sort', sort);
        return this;
    }

    public source(value:boolean):EsInnerHits {
        this.setProperty('_source', value);
        return this;
    }

    public version(value:boolean):EsInnerHits {
        this.setProperty('version', value);
        return this;
    }

    public explain(value:boolean):EsInnerHits {
        this.setProperty('explain', value);
        return this;
    }

    public highlighting(highlightQuery:EsQueryDsl ):EsInnerHits {
        this.setProperty('highlight', highlightQuery)
        return this;
    }

    public scriptFields(scriptFields:EsQueryDsl ):EsInnerHits {
        this.setProperty('script_fileds', scriptFields);
        return this;
    }
}
