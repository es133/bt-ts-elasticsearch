export interface BtEsResponse {
    status():number;
}

export interface BtEsResponseConstructor {
    new(body:any, statusCode:number):BtEsResponse;
}
