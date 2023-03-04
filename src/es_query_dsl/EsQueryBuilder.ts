'use strict';

import { EsBoolQuery } from './EsBoolQuery';
import { EsBoostingQuery } from './EsBoostingQuery';
import { EsConstantScoreQuery } from './EsConstantScoreQuery';
import { EsDisMaxQuery } from './EsDisMaxQuery';
import { EsDistanceFeatureQuery } from './EsDistanceFeatureQuery';
import { EsExistsQuery } from './EsExistsQuery';
import { EsFunctionScoreQuery } from './EsFunctionScoreQuery';
import { EsFuzzyQuery } from'./EsFuzzyQuery';
import { EsHasChildQuery } from './EsHasChildQuery';
import { EsHasParentQuery } from './EsHasParentQuery';
import { EsIdsQuery } from './EsIdsQuery';
import { EsInnerHits } from './EsInnerHits';
import { EsMatchAllQuery } from './EsMatchAllQuery';
import { EsMatchBoolPrefixQuery } from './EsMatchBoolPrefixQuery';
import { EsMatchQuery } from './EsMatchQuery';
import { EsMatchPhraseQuery } from './EsMatchPhraseQuery';
import { EsMultiMatchQuery } from './EsMultiMatchQuery';
import { EsPrefixQuery } from './EsPrefixQuery';
import { EsQueryStringQuery } from './EsQueryStringQuery';
import { EsRangeQuery } from './EsRangeQuery';
import { EsRegexpQuery } from './EsRegexpQuery';
import { EsSimpleQueryStringQuery } from './EsSimpleQueryStringQuery';
import { EsScriptQuery } from './EsScriptQuery';
import { EsTermQuery } from './EsTermQuery';
import { EsTermsQuery } from './EsTermsQuery';
import { EsWildcardQuery } from './EsWildcardQuery';
import { EsPinnedQuery } from './EsPinnedQuery';
import { EsQueryDsl } from "../interface/EsQueryDsl";
import {EsMatchPhrasePrefixQuery} from "./EsMatchPhrasePrefixQuery";
import {EsNestedQuery} from "./EsNestedQuery";
import {EsParentIdQuery} from "./EsParentIdQuery";

export class EsQueryBuilder {

    static boolQuery():EsBoolQuery {
        return new EsBoolQuery();
    }

    static boostingQuery():EsBoostingQuery {
        return new EsBoostingQuery();
    }

    static constantScoreQuery(filter:EsQueryDsl, boost:number):EsConstantScoreQuery {
        return new EsConstantScoreQuery(filter, boost);
    }

    static disMaxQuery(queries?:Array<EsQueryDsl>):EsDisMaxQuery {
        return new EsDisMaxQuery(queries);
    }

    static distanceFeatureQuery(field?:string, origin?: string | [number, number], pivot?:string):EsDistanceFeatureQuery {
        return new EsDistanceFeatureQuery(field, origin, pivot);
    }

    static existsQuery(fieldName:string): EsExistsQuery {
        return new EsExistsQuery(fieldName);
    }

    static functionScoreQuery(subQuery:EsQueryDsl):EsFunctionScoreQuery {
        return new EsFunctionScoreQuery(subQuery);
    }

    static fuzzyQuery(field:string, value?:string): EsFuzzyQuery {
        return new EsFuzzyQuery(field, value);
    }

    static hasChildQuery(type:string, subQuery?:EsQueryDsl): EsHasChildQuery {
        return new EsHasChildQuery(type, subQuery);
    }

    static hasParentQuery(parentType:string, subQuery?:EsQueryDsl): EsHasParentQuery {
        return new EsHasParentQuery(parentType, subQuery);
    }

    static idsQuery(idList:Array<number|string>): EsIdsQuery {
        return new EsIdsQuery(idList);
    }

    static innerHits(): EsInnerHits {
        return new EsInnerHits();
    }

    static matchAllQuery():EsMatchAllQuery {
        return new EsMatchAllQuery();
    }

    static matchBoolPrefixQUery(field:string, text?:string): EsMatchBoolPrefixQuery {
        return new EsMatchBoolPrefixQuery(field, text);
    }

    static matchPhrasePrefixQuery(field:string, text?:string): EsMatchPhrasePrefixQuery {
        return new EsMatchPhrasePrefixQuery(field, text);
    }

    static matchPhraseQuery(field:string, text?:string): EsMatchPhraseQuery {
        return new EsMatchPhraseQuery(field, text);
    }

    static matchQuery(field:string, text?:string): EsMatchQuery {
        return new EsMatchQuery(field, text);
    }

    static multiMatchQuery(queryString?:string, fields?:string|Array<string>): EsMultiMatchQuery {
        return new EsMultiMatchQuery(queryString, fields);
    }

    static nestedQuery(path:string, subQuery?:EsQueryDsl): EsNestedQuery {
        return new EsNestedQuery(path, subQuery);
    }

    static parentIdQuery(relationName?:string, parentDocId?:string): EsParentIdQuery {
        return new EsParentIdQuery(relationName, parentDocId);
    }

    static pinnedQuery(idList?:Array<number|string>, organicQuery?:EsQueryDsl): EsPinnedQuery {
        return new EsPinnedQuery(idList, organicQuery);
    }

    static prefixQuery(field: string, value?: any, boost?: number): EsPrefixQuery {
        return new EsPrefixQuery(field, value, boost);
    }

    static queryStringQuery(fields?:Array<string>, query?:string): EsQueryStringQuery {
        return new EsQueryStringQuery(fields, query);
    }

    static rangeQuery(field:string, from?: number|string, to?:number|string): EsRangeQuery {
        return new EsRangeQuery(field, from, to);
    }

    static regexpQuery(field: string, value?: string): EsRegexpQuery {
        return new EsRegexpQuery(field, value);
    }

    static scriptQuery(source?:string, params?:any): EsScriptQuery {
        return new EsScriptQuery(source, params);
    }

    static simpleQueryStringQuery(fields?:Array<string>, query?: string): EsSimpleQueryStringQuery {
        return new EsSimpleQueryStringQuery(fields, query);
    }

    static termQuery(field:string, value?:any, boost?:number): EsTermQuery {
        return new EsTermQuery(field, value, boost);
    }

    static termsQuery(field: string, terms?: Array<string|number>): EsTermsQuery {
        return new EsTermsQuery(field, terms);
    }

    static wildcardQuery (field:string, value?:string, boost?:number): EsWildcardQuery{
        return new EsWildcardQuery(field, value, boost);
    }
}
