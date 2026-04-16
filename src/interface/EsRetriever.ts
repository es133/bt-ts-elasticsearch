export interface EsRetriever {
    name(): string;
    body(): any;
    isEsRetriever(): boolean;
}
