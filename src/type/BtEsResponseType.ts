export type BtEsIndexResponseType = {
    index:number;
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
    index:number;
    id:number;
    version:number;
    sequenceNumber:number;
    primaryTerm:number;
    found:boolean;
    source:any;
}