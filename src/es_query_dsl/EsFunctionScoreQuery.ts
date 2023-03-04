'use strict';

import { EsQueryDsl } from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "./EsAbstractQueryDsl";
import {BT_ES_SCORE_CALC_MODE} from "../type/BtEsEnums";

export class EsFunctionScoreQuery extends EsAbstractQueryDsl {
    constructor(subQuery:EsQueryDsl){
        super('function_score');
        this.setProperty('query', subQuery);
    }

    public functions(scoreFunction:any): EsFunctionScoreQuery {

        if (this.hasProperty('functions')) {
            this.addProperty('functions', scoreFunction);
        } else {
            this.setProperty('functions', scoreFunction);
        }
        return this;
    }

    public weight(weight:number): EsFunctionScoreQuery {
        this.setProperty('weight', weight);
        return this;
    }

    public boost(value:number): EsFunctionScoreQuery {
        this.setProperty('boost', value);
        return this;
    }

    public maxBoost(value:number):EsFunctionScoreQuery {
        this.setProperty('max_boost', value);
        return this;
    }

    public minScore(score:number):EsFunctionScoreQuery {
        this.setProperty('min_score', score);
        return this;
    }

    public scoreMode(mode:BT_ES_SCORE_CALC_MODE): EsFunctionScoreQuery {
        /*
        multiply    scores are multiplied (default)
        sum         scores are summed
        avg         scores are averaged
        first       the first function that has a matching filter is applied
        max         maximum score is used
        min         minimum score is used
        */
        this.setProperty('score_mode', mode);
        return this;
    }

    public boostMode(value:BT_ES_SCORE_CALC_MODE):EsFunctionScoreQuery {
        /*
        multiply    es_query_dsl score and function score is multiplied (default)
        replace     only function score is used, the es_query_dsl score is ignored
        sum         es_query_dsl score and function score are added
        avg         average
        max         max of es_query_dsl score and function score
        min         min of es_query_dsl score and function score
         */
        this.setProperty('boost_mode', value);
        return this;
    }

}
