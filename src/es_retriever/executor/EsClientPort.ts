export interface EsClientPort {
    search(params: Record<string, any>): Promise<any>;
    msearch(params: Record<string, any>): Promise<any>;
    mget(params: Record<string, any>): Promise<any>;
}
