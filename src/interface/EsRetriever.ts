export interface EsRetriever {
    name(): string;
    body(): Record<string, any>;
    isEsRetriever(): boolean;
}
