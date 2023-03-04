import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';
import {EsQueryDsl} from "../interface/EsQueryDsl";

export class EsBoolQuery extends EsAbstractQueryDsl {
    constructor(){
        super('bool');
        //console.log(this._body);
    }

    public must(subQueryDsl: EsQueryDsl):EsQueryDsl {

        this.addProperty('must', subQueryDsl);
        return this;
    }

    public should(subQueryDsl: EsQueryDsl):EsQueryDsl {

        this.addProperty('should', subQueryDsl);
        return this;
    }

    public mustNot(subQueryDsl: EsQueryDsl):EsQueryDsl {

        this.addProperty('must_not', subQueryDsl);
        return this;
    }

    public filter(filter: EsQueryDsl):EsQueryDsl {

        this.addProperty('filter', filter);
        return this;
    }

    public minimumShouldMatch(value: number):EsQueryDsl {
        this.setProperty('minimum_should_match', value);
        return this;
    }

    public boost(value: number):EsQueryDsl {
        this.setProperty('boost', value);
        return this;
    }
}
