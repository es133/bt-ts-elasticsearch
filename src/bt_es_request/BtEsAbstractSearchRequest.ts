import { BtEsRequestUtil } from './BtEsRequestUtil';
import { BtEsAbstractRequest } from './BtEsAbstractRequest';
import {ES_QUERY_PARAM, ES_SEARCH_TYPE, ES_VERSION_TYPE} from "../type/BtEsEnums";
import {EsQueryDsl} from "../interface/EsQueryDsl";
import {EsRetriever} from "../interface/EsRetriever";
import { ScriptFields, DocValueFields } from '../type/EsRequestTypes';

export class BtEsAbstractSearchRequest extends BtEsAbstractRequest {

    protected sort: Record<string, any> | null;
    protected query: EsQueryDsl | null;
    protected retriever: EsRetriever | null;
    protected highlight: Record<string, any> | null;
    protected aggregations: Record<string, any> | null;
    protected suggest: Record<string, any> | null;
    protected postFilter: EsQueryDsl | null;
    protected scroll: string | null;
    protected scrollId: string | null;
    protected searchAfter: Array<string | number> | null;
    protected pit: null | {id: string, keep_alive: string};

    constructor(){
        super();
        this.param[ES_QUERY_PARAM.SEARCH_TYPE] = ES_SEARCH_TYPE.QUERY_THEN_FETCH;
        this.param[ES_QUERY_PARAM.EXPLAIN] = false;
        this.param[ES_QUERY_PARAM.BODY] = {};
        this.param[ES_QUERY_PARAM.SOURCE] = false;
        this.param[ES_QUERY_PARAM.TRACK_TOTAL_HITS] = true;
        this.sort = null;
        this.query = null;
        this.retriever = null;
        this.highlight = null;
        this.aggregations = null;
        this.suggest = null;
        this.postFilter = null;
        this.scroll = null;
        this.scrollId = null;
        this.searchAfter = null;
        this.pit = null;
    }

    public setSize(size:number):void {
        this.param[ES_QUERY_PARAM.SIZE] = size;
    }

    public getSize():number {
        return this.param[ES_QUERY_PARAM.SIZE];
    }

    public setFrom(from:number):void {
        this.param[ES_QUERY_PARAM.FROM] = from;
    }

    public getFrom():number {
        return this.param[ES_QUERY_PARAM.FROM];
    }

    public set size(size:number) {
        this.setSize(size);
    }

    public get size():number {
        return this.getSize();
    }

    public set from(from) {
        this.setFrom(from);
    }

    public get from():number {
        return this.getFrom();
    }

    public setSearchType(searchType:ES_SEARCH_TYPE):void {
        this.param[ES_QUERY_PARAM.SEARCH_TYPE] = searchType;
    }

    public set searchType(searchType:ES_SEARCH_TYPE) {
        this.setSearchType(searchType);
    }

    public setTimeout(timeout:number):void {
        this.param[ES_QUERY_PARAM.TIMEOUT] = timeout;
    }

    public set timeout(timeout:number) {
        this.setTimeout(timeout);
    }

    public set trackTotalHits(value:boolean) {
        this.param[ES_QUERY_PARAM.TRACK_TOTAL_HITS] = value;
    }

    public addSort(sort:EsQueryDsl) {
        if (this.sort === undefined || this.sort === null) {
            this.sort = {'sort': []};
        }
        this.sort['sort'].push(BtEsRequestUtil.buildQueryParam(sort));
    }

    public addAggregations(aggregations:EsQueryDsl) {
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

    public setScriptFields(scriptFields:ScriptFields) {
        if (scriptFields !== undefined && scriptFields !== null) {
            this.param[ES_QUERY_PARAM.SCRIPT_FIELDS] = scriptFields;
        }
    }

    public setDocValueFields(fields:DocValueFields) {
        if (fields !== undefined && fields !== null) {
            this.param[ES_QUERY_PARAM.DOC_VALUE_FIELDS] = fields;
        }
    }

    public setScroll(scroll:string) {
        if (scroll !== undefined && scroll !== null) {
            this.scroll = scroll;
        }
    }

    public setScrollId(scrollId:string|null) {
        if (scrollId !== undefined && scrollId !== null) {
            this.scrollId = scrollId;
        }
    }

    public setSearchAfter(value: string | number): void {
        if (value !== undefined && value !== null) {
            this.searchAfter = [value];
        }
    }

    public getSearchAfter(): Array<string | number> | null {
        return this.searchAfter;
    }

    public setPit(id: string, keepAlive: string): void {
        if (!this.pit) {
            this.pit = { id: id, keep_alive: keepAlive }
        } else {
            this.pit.id = id;
            this.pit.keep_alive = keepAlive;
        }
    }

    public getPit(): null | {id: string, keep_alive: string} {
        return this.pit;
    }

    public setQueryDsl(queryDsl:EsQueryDsl):void {
        this.query = queryDsl;
    }

    public getQueryDsl():EsQueryDsl | null {
        return this.query;
    }

    public setRetriever(retriever:EsRetriever):void {
        this.retriever = retriever;
    }

    public getRetriever():EsRetriever | null {
        return this.retriever;
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

    public getParam(): Record<string, any> {
        if (this.retriever !== null) {
            this.param[ES_QUERY_PARAM.BODY][ES_QUERY_PARAM.RETRIEVER] = BtEsRequestUtil.buildRetrieverParam(this.retriever);
        } else if (this.query !== null) {
            this.param[ES_QUERY_PARAM.BODY][ES_QUERY_PARAM.QUERY] = BtEsRequestUtil.buildQueryParam(this.query);
        }
        if (this.highlight !== null) {
            Object.assign(this.param[ES_QUERY_PARAM.BODY], this.highlight);
        }
        if (this.aggregations !== null) {
            Object.assign(this.param[ES_QUERY_PARAM.BODY], this.aggregations);
        }
        if (this.sort !== null) {
            Object.assign(this.param[ES_QUERY_PARAM.BODY], this.sort);
        }
        if (this.postFilter !== null) {
            Object.assign(this.param[ES_QUERY_PARAM.BODY], BtEsRequestUtil.buildQueryParam(this.postFilter));
        }
        if (this.scroll !== null) {
            this.param[ES_QUERY_PARAM.SCROLL] = this.scroll;
        }

        return this.param;
    }
}
