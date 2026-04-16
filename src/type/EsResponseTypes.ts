export type EsHit<T = unknown> = {
  _index: string;
  _id: string;
  _score: number | null;
  _source: T;
  _version?: number;
  fields?: Record<string, any>;
  highlight?: Record<string, string[]>;
  sort?: any[];
}

export type EsHits<T = unknown> = {
  total: {
    value: number;
    relation: 'eq' | 'gte';
  };
  max_score: number | null;
  hits: EsHit<T>[];
}

export type EsShards = {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

export type EsAggregationBucket = {
  key: string | number;
  doc_count: number;
  [key: string]: any;
}

export type EsAggregationResult = {
  [key: string]: {
    buckets?: EsAggregationBucket[];
    value?: number;
    values?: Record<string, number>;
    doc_count?: number;
    [key: string]: any;
  };
}

export type EsSearchResponseBody<T = unknown> = {
  took: number;
  timed_out: boolean;
  _shards: EsShards;
  hits: EsHits<T>;
  aggregations?: EsAggregationResult;
  _scroll_id?: string;
  pit_id?: string;
}
