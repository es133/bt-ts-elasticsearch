import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsSearchResponse extends BtEsAbstractResponse {

    protected took?:number;
    protected scrollId?:string;
    protected totalCount?:number;
    protected maxScore?:number;
    protected hits?:any;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        this.took = body['took'];
        if (body.hasOwnProperty('hits')) {
            const hits = body['hits'];
            if (hits.hasOwnProperty('total')) {
                this.totalCount = hits['total']['value'];
            }
            if (hits.hasOwnProperty('max_score')) {
                this.maxScore = hits['max_score'];
            }
            if (hits.hasOwnProperty('hits')) {
                this.hits = hits['hits'];
            }
        }
        if (body.hasOwnProperty('_scroll_id')) {
            this.scrollId = body['_scroll_id'];
        }
    }

    public getResponseTime(): number {
        if (this.took) {
            return this.took;
        } else {
            return 0;
        }
    }

    public getScrollId(): string | null {
        if (this.scrollId) {
            return this.scrollId;
        } else {
            return null;
        }
    }

    public getTotalCount(): number {
        if (this.totalCount) {
            return this.totalCount;
        } else {
            return 0;
        }
    }

    public getMaxScore(): number {
        if (this.maxScore) {
            return this.maxScore;
        } else {
            return 0;
        }
    }

    public getHits(): any {
        if (this.hits) {
            return this.hits;
        } else {
            return null;
        }
    }
}