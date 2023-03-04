'use strict';

import { EsAvgAggregation } from './EsAvgAggregation';
import { EsCardinalityAggregation } from './EsCardinalityAggregation';
import { EsChildrenAggregation } from './EsChildrenAggregation';
import { EsDateRangeAggregation } from './EsDateRangeAggregation';
import { EsDateHistogramAggregation } from './EsDateHistogramAggregation';
import { EsExtendedStatsAggregation } from './EsExtendedStatsAggregation';
import { EsStatsAggregation } from './EsStatsAggregation';
import { EsFilterAggregation } from './EsFilterAggregation';
import { EsMaxAggregation } from './EsMaxAggregation';
import { EsMinAggregation } from './EsMinAggregation';
import { EsMissingAggregation } from './EsMissingAggregation';
import { EsNestedAggregation } from './EsNestedAggregation';
import { EsRangeAggregation } from './EsRangeAggregation';
import { EsReverseNestedAggregation } from './EsReverseNestedAggregation';
import { EsSumAggregation } from './EsSumAggregation';
import { EsTermsAggregation } from './EsTermsAggregation';
import { EsValueCountAggregation } from './EsValueCountAggregation';
import { EsAvgBucketAggregation } from './EsAvgBucketAggregation';
import { EsMinBucketAggregation } from './EsMinBucketAggregation';
import { EsMaxBucketAggregation } from './EsMaxBucketAggregation';
import { EsBucketScriptAggregation } from './EsBucketScriptAggregation';
import { EsBucketSelectorAggregation } from './EsBucketSelectorAggregation';
import { EsBucketSortAggregation } from './EsBucketSortAggregation';
import { EsTopHitsAggregation } from './EsTopHitsAggregations';
import { EsMovingFunctionAggregation } from './EsMovingFunctionAggregation';
import { EsSerialDiffAggregation } from './EsSerialDiffAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";
import {EsMultipleFilterAggregation} from "./EsMultipleFilterAggregation";

export class EsAggregationBuilder {
    constructor() {

    }
    static avgAggregations(name:string, field?:string):EsAvgAggregation {
        return new EsAvgAggregation(name, field);
    }

    static avgBucketAggregations(name:string, path?:string):EsAvgBucketAggregation {
        return new EsAvgBucketAggregation(name, path);
    }

    static bucketScriptAggregations(name:string, path?:string):EsBucketScriptAggregation {
        return new EsBucketScriptAggregation(name, path);
    }

    static bucketSelectorAggregations(name:string, path?:string):EsBucketSelectorAggregation {
        return new EsBucketSelectorAggregation(name, path);
    }

    static bucketSortAggregations(name:string):EsBucketSortAggregation {
        return new EsBucketSortAggregation(name);
    }

    static cardinalityAggregations(name:string, field?:string):EsCardinalityAggregation {
        return new EsCardinalityAggregation(name, field);
    }

    static childrenAggregations(name:string):EsChildrenAggregation {
        return new EsChildrenAggregation(name);
    }

    static dateHistogramAggregations(name:string, field?:string):EsDateHistogramAggregation {
        return new EsDateHistogramAggregation(name, field);
    }

    static dateRangeAggregations(name:string, field?:string):EsDateRangeAggregation {
        return new EsDateRangeAggregation(name, field);
    }

    static extendedStatsAggregations(name:string):EsExtendedStatsAggregation {
        return new EsExtendedStatsAggregation(name);
    }

    static filterAggregations(name:string):EsFilterAggregation {
        return new EsFilterAggregation(name);
    }

    static maxAggregations(name:string, field?:string):EsMaxAggregation {
        return new EsMaxAggregation(name, field);
    }

    static maxBucketAggregations(name:string, path?:string):EsMaxBucketAggregation {
        return new EsMaxBucketAggregation(name, path);
    }

    static minAggregations(name:string, field?:string):EsMinAggregation {
        return new EsMinAggregation(name, field);
    }

    static minBucketAggregations(name:string, path?:string):EsMinBucketAggregation {
        return new EsMinBucketAggregation(name, path);
    }

    static missingAggregations(name:string, field?:string):EsMissingAggregation {
        return new EsMissingAggregation(name, field);
    }

    static movingFunctionAggregations(name:string, path?:string):EsMovingFunctionAggregation {
        return new EsMovingFunctionAggregation(name, path);
    }

    static multipleFilterAggregations(name:string, filter?:EsQueryDsl):EsMultipleFilterAggregation {
        return new EsMultipleFilterAggregation(name, filter);
    }

    static nestedAggregations(name:string):EsNestedAggregation {
        return new EsNestedAggregation(name);
    }

    static rangeAggregations(name:string, field?:string):EsRangeAggregation {
        return new EsRangeAggregation(name, field);
    }

    static reverseNestedAggregations(name:string):EsReverseNestedAggregation {
        return new EsReverseNestedAggregation(name);
    }

    static serialDiffAggregations(name:string, path?:string):EsSerialDiffAggregation {
        return new EsSerialDiffAggregation(name, path);
    }

    static statsAggregations(name:string):EsStatsAggregation {
        return new EsStatsAggregation(name);
    }

    static sumAggregations(name:string, field?:string):EsSumAggregation {
        return new EsSumAggregation(name, field);
    }

    static termsAggregations(name:string, field?:string):EsTermsAggregation {
        return new EsTermsAggregation(name, field);
    }

    static topHitsAggregations(name:string, sort?:any):EsTopHitsAggregation {
        return new EsTopHitsAggregation(name, sort);
    }

    static valueCountAggregations(name:string, field?:string):EsValueCountAggregation {
        return new EsValueCountAggregation(name, field);
    }
}
