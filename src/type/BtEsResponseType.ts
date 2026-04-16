export type BtEsIndexResponseType = {
    index:string;
    id:number;
    version:number;
    result:string;
    sequenceNumber:number;
    primaryTerm:number;
    status?:number;
    action?:string;

    shardInfo: {
        total: number;
        success: number;
        fail: number;
    };
}

export type BtEsGetResponseType = {
    index:string;
    id:number;
    version:number;
    sequenceNumber:number;
    primaryTerm:number;
    found:boolean;
    source:any;
}

export type BtIndicesAnalyzeToken = {
    end_offset: number;
    position: number;
    positionLength?: number;
    start_offset: number;
    token: string;
    type: string;
}

export type BtEsUpdateByQueryResponseType = {
    took : number,
    timed_out: boolean,
    total: number,
    deleted: number,
    batches: number,
    version_conflicts: number,
    noops: number,
    retries: {
        bulk: number,
        search:number
    },
    throttled_millis: number,
    requests_per_second: number,
    throttled_until_millis: number,
    failures : []
}