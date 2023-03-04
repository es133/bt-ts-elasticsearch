export interface EsQueryDsl {
    name(): string;
    body(): any;
    isEsQueryDsl():boolean;
}