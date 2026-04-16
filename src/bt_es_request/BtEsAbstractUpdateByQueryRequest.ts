'use strict';
import { BtEsRequestUtil } from './BtEsRequestUtil';
import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {ES_QUERY_LOGIC_OPERATOR, ES_SEARCH_TYPE, ES_UPDATE_CONFLICT_POLICY} from "../type/BtEsEnums";
import { RoutingValue, ScriptDefinition } from '../type/EsRequestTypes';

export class BtEsAbstractUpdateByQueryRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.param['body'] = null;
    }

    public setTimeout(duration:number):void {
        this.param['timeout'] = duration;
    }

    public setConflicts(policy:ES_UPDATE_CONFLICT_POLICY):void {
        this.param['conflicts'] = policy;
    }

    public setRouting(routing:RoutingValue):void {
        this.param['routing'] = routing;
    }

    public setAllowNoIndices(value:boolean):void {
        this.param['allow_no_indices'] = value;
    }

    public setAnalyzer(analyzer:string):void {
        this.param['analyzer'] = analyzer;
    }

    public setAnalyzeWildcard(value:boolean):void {
        this.param['analyze_wildcard'] = value;
    }

    public setDefaultOperator(operator:ES_QUERY_LOGIC_OPERATOR):void {
        this.param['default_operator'] = operator;
    }

    public setExpandWildcards(indexState:string):void {
        this.param['expand_wildcards'] = indexState;
    }

    public setFrom(from:number):void {
        this.param['from'] = from;
    }

    public setIgnoreUnavailable(value:boolean):void {
        this.param['ignore_unavailable'] = value;
    }

    public setLenient(value:boolean):void {
        this.param['lenient'] = value;
    }

    public setMaxDocs(docCount:number):void {
        this.param['max_docs'] = docCount;
    }

    public setPipeline(pipelineId:number|string):void {
        this.param['pipeline'] = pipelineId;
    }

    public setRequestCache(value:boolean):void {
        this.param['request_cache'] = value;
    }

    public setRefresh(value:boolean):void {
        this.param['refresh'] = value;
    }

    public setScroll(timeValue:string):void {
        this.param['scroll'] = timeValue;
    }

    public setScrollSize(size:number):void {
        this.param['scroll_size'] = size;
    }

    public setSearchType(searchType:ES_SEARCH_TYPE):void {
        this.param['search_type'] = searchType;
    }

    public setSearchTimeout(timeValue:string):void {
        this.param['search_timeout'] = timeValue;
    }

    public setSlices(value:number):void {
        this.param['slices'] = value;
    }

    //A comma-separated list of <field>:<direction> pairs.
    public setSort(sort:string | string[]):void {
        this.param['sort'] = sort;
    }

    public setStats(tag:string | string[]):void {
        this.param['stats'] = tag;
    }

    public setWaitForActiveShards(value:number):void {
        this.param['wait_for_active_shards'] = value;
    }

    public set timeout(duration:number) {
        this.setTimeout(duration);
    }

    public set conflicts(policy:ES_UPDATE_CONFLICT_POLICY) {
        this.setConflicts(policy);
    }

    public set routing (routing:string) {
        this.setRouting(routing);
    }

    public set allowNoIndices(value:boolean) {
        this.setAllowNoIndices(value);
    }

    public set analyzer(analyzer:any) {
        this.setAnalyzer(analyzer);
    }

    public set analyzeWildcard(value:boolean) {
        this.setAnalyzeWildcard(value);
    }

    public set defaultOperator(operator:ES_QUERY_LOGIC_OPERATOR) {
        this.setDefaultOperator(operator);
    }

    public set expandWildcards(indexState:string) {
        this.setExpandWildcards(indexState);
    }

    public set from(from:number) {
        this.setFrom(from);
    }

    public set ignoreUnavailable(value:boolean) {
        this.setIgnoreUnavailable(value);
    }

    public set lenient(value:boolean) {
        this.setLenient(value);
    }

    public set maxDocs(docCount:number) {
        this.setMaxDocs(docCount);
    }

    public set pipeline(pipelineId:number|string) {
        this.setPipeline(pipelineId);
    }

    public set requestCache(value:boolean) {
        this.setRequestCache(value);
    }

    public set refresh(value:boolean) {
        this.setRefresh(value);
    }

    public set scroll(timeValue:string) {
        this.setScroll(timeValue);
    }

    public set scrollSize(size:number) {
        this.setScrollSize(size);
    }

    public set searchType(searchType:ES_SEARCH_TYPE) {
        this.setSearchType(searchType);
    }

    public set searchTimeout(timeValue:string) {
        this.setSearchTimeout(timeValue);
    }

    public set slices(value:number) {
        this.setSlices(value);
    }

    public set sort(sort:any) {
        this.setSort(sort);
    }

    public set stats(tag:any) {
        this.setStats(tag);
    }

    public set waitForActiveShards(value:number) {
        this.setWaitForActiveShards(value);
    }

    public setQueryDsl(query:any) {

        if (this.param['body'] === null) {
            this.param['body'] = {};
        }
        if (query !== undefined && query !== null) {
            this.param['body']['query'] = BtEsRequestUtil.buildQueryParam(query);
        }
    }

    public setScript(script:any, lang:string) {
        if (this.param['body'] === null) {
            this.param['body'] = {};
        }
        if (script !== undefined && script !== null) {
            this.param['body']['script'] = script;
        }
        if (lang !== undefined && lang !== null) {
            this.param['body']['script']['lang'] = lang ;
        }
    }
}
