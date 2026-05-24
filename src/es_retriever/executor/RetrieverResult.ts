export type RankedHit = {
    id: string;
    index: string;
    score: number;
    source?: any;
    highlight?: Record<string, string[]>;
};

export type RetrieverTotal = {
    value: number;
    relation: 'eq' | 'gte';
};

export type RetrieverResult = {
    rankedIds: RankedHit[];
    total: RetrieverTotal;
    aggregations?: Record<string, any>;
};
