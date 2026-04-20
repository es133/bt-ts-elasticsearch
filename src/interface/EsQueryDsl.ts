export interface EsQueryDsl {
    name(): string;
    body(): Record<string, any>;
    isEsQueryDsl():boolean;
}