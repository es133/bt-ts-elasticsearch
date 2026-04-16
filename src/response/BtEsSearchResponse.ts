import {BtEsResponse} from "../interface/BtEsResponse";
import {EsHits, EsShards, EsAggregationResult} from "../type/EsResponseTypes";

export class BtEsSearchResponse<T = unknown> implements BtEsResponse {

    public took?:number;
    public timedOut?: boolean;
    public scrollId?:string;
    public pitId?:string;
    public totalCount?:number;
    public maxScore?:number | null;
    public hits?:EsHits<T>;
    public shards: EsShards;
    public aggregations?:EsAggregationResult;

    constructor(response:any) {
        this.took = response?.['took'];
        this.timedOut = response?.['timed_out'];
        if(response?.['hits']) {
            this.hits = response?.['hits'];
            this.totalCount = this.hits?.total?.value;
            this.maxScore = this.hits?.max_score;
        }
        this.aggregations = response?.['aggregations'];
        this.scrollId = response?.['scroll_id'];
        this.pitId = response?.['pit_id'];
        this.shards = response?.['shards'];
    }

    public toString(): string{
        return JSON.stringify({
            took: this.took,
            timedOut: this.timedOut,
            scrollId: this.scrollId,
            pitId: this.pitId,
            totalCount: this.totalCount,
            maxScore: this.maxScore,
            hits: this.hits,
            shards: this.shards,
            aggregations: this.aggregations,
        })
    }
}