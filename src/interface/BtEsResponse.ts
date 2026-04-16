export interface BtEsResponse {
    toString(): string;
}

export interface BtEsResponseConstructor {
    new(body: any, statusCode: number): BtEsResponse;
}
