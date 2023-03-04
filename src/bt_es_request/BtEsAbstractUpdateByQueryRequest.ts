'use strict';
import { BtEsRequestUtil } from './BtEsRequestUtil';
import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {BT_ES_QUERY_LOGIC_OPERATOR, BT_ES_SEARCH_TYPE, BT_ES_UPDATE_CONFLICT_POLICY} from "../type/BtEsEnums";

export class BtEsAbstractUpdateByQueryRequest extends BtEsAbstractRequest {
    constructor() {
        super();
        this.requestParam['body'] = null;
    }

    public setTimeout(duration:number):void {
        this.requestParam['timeout'] = duration;
    }

    public setConflicts(policy:BT_ES_UPDATE_CONFLICT_POLICY):void {
        this.requestParam['conflicts'] = policy;
    }

    public setRouting (routing:string):void {
        this.requestParam['routing'] = routing;
    }

    public setAllowNoIndices(value:boolean):void {
        this.requestParam['allow_no_indices'] = value;
    }

    public setAnalyzer(analyzer:any):void {
        this.requestParam['analyzer'] = analyzer;
    }

    public setAnalyzeWildcard(value:boolean):void {
        this.requestParam['analyze_wildcard'] = value;
    }

    public setDefaultOperator(operator:BT_ES_QUERY_LOGIC_OPERATOR):void {
        this.requestParam['default_operator'] = operator;
    }

    public setExpandWildcards(indexState:string):void {
        this.requestParam['expand_wildcards'] = indexState;
    }

    public setFrom(from:number):void {
        this.requestParam['from'] = from;
    }

    public setIgnoreUnavailable(value:boolean):void {
        this.requestParam['ignore_unavailable'] = value;
    }

    public setLenient(value:boolean):void {
        this.requestParam['lenient'] = value;
    }

    public setMaxDocs(docCount:number):void {
        this.requestParam['max_docs'] = docCount;
    }

    public setPipeline(pipelineId:number|string):void {
        this.requestParam['pipeline'] = pipelineId;
    }

    public setRequestCache(value:boolean):void {
        this.requestParam['request_cache'] = value;
    }

    public setRefresh(value:boolean):void {
        this.requestParam['refresh'] = value;
    }

    public setScroll(timeValue:string):void {
        this.requestParam['scroll'] = timeValue;
    }

    public setScrollSize(size:number):void {
        this.requestParam['scroll_size'] = size;
    }

    public setSearchType(searchType:BT_ES_SEARCH_TYPE):void {
        this.requestParam['search_type'] = searchType;
    }

    public setSearchTimeout(timeValue:string):void {
        this.requestParam['search_timeout'] = timeValue;
    }

    public setSlices(value:number):void {
        this.requestParam['slices'] = value;
    }

    //A comma-separated list of <field>:<direction> pairs.
    public setSort(sort:any):void {
        this.requestParam['sort'] = sort;
    }

    public setStats(tag:any):void {
        this.requestParam['stats'] = tag;
    }

    public setWaitForActiveShards(value:number):void {
        this.requestParam['wait_for_active_shards'] = value;
    }

    public setQuery(query:any) {

        if (this.requestParam['body'] === null) {
            this.requestParam['body'] = {};
        }
        if (query !== undefined && query !== null) {
            this.requestParam['body']['query'] = BtEsRequestUtil.buildQueryParam(query);
        }
    }

    public setScript(script:any, lang:string) {
        if (this.requestParam['body'] === null) {
            this.requestParam['body'] = {};
        }
        if (script !== undefined && script !== null) {
            this.requestParam['body']['script'] = script;
        }
        if (lang !== undefined && lang !== null) {
            this.requestParam['body']['script']['lang'] = lang ;
        }
    }
}
