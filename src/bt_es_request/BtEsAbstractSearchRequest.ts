import { BtEsRequestUtil } from './BtEsRequestUtil';
import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {BT_ES_QUERY_PARAM, BT_ES_SEARCH_TYPE, BT_ES_VERSION_TYPE} from "../type/BtEsEnums";
import {EsQueryDsl} from "../interface/EsQueryDsl";

export class BtEsAbstractSearchRequest extends BtEsAbstractRequest {

    protected sort:any;
    protected query:any;
    protected highlight:any;
    protected aggregations:any;
    protected suggest:any;
    protected postFilter:any;
    protected scroll:any;
    protected scrollId:string | null;

    constructor(){
        super();
        this.requestParam[BT_ES_QUERY_PARAM.SEARCH_TYPE] = BT_ES_SEARCH_TYPE.QUERY_THEN_FETCH;
        this.requestParam[BT_ES_QUERY_PARAM.EXPLAIN] = false;
        this.requestParam[BT_ES_QUERY_PARAM.BODY] = {};
        this.requestParam[BT_ES_QUERY_PARAM.SOURCE] = false;
        this.requestParam[BT_ES_QUERY_PARAM.TRACK_TOTAL_HITS] = true;
        this.sort = null;
        this.query = null;
        this.highlight = null;
        this.aggregations = null;
        this.suggest = null;
        this.postFilter = null;
        this.scroll = null;
        this.scrollId = null;
    }

    public setSize(size:number):void {
        this.requestParam[BT_ES_QUERY_PARAM.SIZE] = size;
    }

    public getSize():number {
        return this.requestParam[BT_ES_QUERY_PARAM.SIZE];
    }

    public setFrom(from:number):void {
        this.requestParam[BT_ES_QUERY_PARAM.FROM] = from;
    }

    public getFrom():number {
        return this.requestParam[BT_ES_QUERY_PARAM.FROM];
    }

    public setSearchType(searchType:BT_ES_SEARCH_TYPE):void {
        this.requestParam[BT_ES_QUERY_PARAM.SEARCH_TYPE] = searchType;
    }

    public setTimeout(timeout:number):void {
        this.requestParam[BT_ES_QUERY_PARAM.TIMEOUT] = timeout;
    }

    public setTrackTotalHits(value:boolean) {
        this.requestParam[BT_ES_QUERY_PARAM.TRACK_TOTAL_HITS] = value;
    }

    public addSort(sort:any) {
        if (this.sort === undefined || this.sort === null) {
            this.sort = {'sort': []};
        }
        this.sort['sort'].push(BtEsRequestUtil.buildQueryParam(sort));
    }

    public addAggregations(aggregations:any) {
        if (this.aggregations === undefined || this.aggregations === null) {
            this.aggregations = {'aggregations': {}};
        }
        Object.assign(this.aggregations['aggregations'], BtEsRequestUtil.buildAggsParam(aggregations));
    }

    public addSuggest(suggest:EsQueryDsl) {
        if (this.suggest === undefined || this.suggest === null) {
            this.suggest = {'suggest': {}};
        }
        Object.assign(this.suggest['suggest'], BtEsRequestUtil.buildSuggestParam(suggest));
    }

    public addHighlight(highlight:EsQueryDsl) {
        if (this.highlight === undefined || this.highlight === null) {
            this.highlight = {};
        }
        Object.assign(this.highlight, BtEsRequestUtil.buildQueryParam(highlight));
    }

    public setScriptFields(scriptFields:any) {
        if (scriptFields !== undefined && scriptFields !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.SCRIPT_FIELDS] = scriptFields;
        }
    }

    public setDocValueFields(fields:any) {
        if (fields !== undefined && fields !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.DOC_VALUE_FIELDS] = fields;
        }
    }

    public setScroll(scroll:any) {
        if (scroll !== undefined && scroll !== null) {
            this.scroll = scroll;
        }
    }

    public setScrollId(scrollId:string|null) {
        if (scrollId !== undefined && scrollId !== null) {
            this.scrollId = scrollId;
        }
    }

    public setQueryDsl(queryDsl:EsQueryDsl):void {
        this.query = queryDsl;
    }

    public getScrollQuery() {
        let scrollParam = {};
        if (this.scroll !== null) {
            Object.assign(scrollParam, this.scroll);
        }
        if (this.scrollId !== null) {
            Object.assign(scrollParam, this.scrollId);
        }
        return scrollParam;
    }

    public getRequestParam() {
        if (this.query !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.BODY][BT_ES_QUERY_PARAM.QUERY] = BtEsRequestUtil.buildQueryParam(this.query);
        }
        if (this.highlight !== null) {
            Object.assign(this.requestParam[BT_ES_QUERY_PARAM.BODY], this.highlight);
        }
        if (this.aggregations !== null) {
            Object.assign(this.requestParam[BT_ES_QUERY_PARAM.BODY], this.aggregations);
        }
        if (this.sort !== null) {
            Object.assign(this.requestParam[BT_ES_QUERY_PARAM.BODY], this.sort);
        }
        if (this.postFilter !== null) {
            Object.assign(this.requestParam[BT_ES_QUERY_PARAM.BODY], BtEsRequestUtil.buildQueryParam(this.postFilter));
        }
        if (this.scroll !== null) {
            this.requestParam[BT_ES_QUERY_PARAM.SCROLL] = this.scroll;
        }

        return this.requestParam;
    }
}
