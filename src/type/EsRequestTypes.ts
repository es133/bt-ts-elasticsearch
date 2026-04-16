export type RoutingValue = string | number;

export type PreferenceValue = 
  | string 
  | '_local' 
  | '_primary' 
  | '_replica' 
  | '_only_node:' 
  | '_prefer_nodes:' 
  | '_shards:';

export type ScriptFields = Record<string, {
  script: {
    source: string;
    lang?: string;
    params?: Record<string, any>;
  };
}>;

export type SortOrder = 'asc' | 'desc';

export type SortOption = 
  | string 
  | Record<string, SortOrder | { 
      order: SortOrder; 
      mode?: 'min' | 'max' | 'sum' | 'avg' | 'median';
      missing?: '_last' | '_first' | string;
      unmapped_type?: string;
    }>;

export type DocValueFields = Array<string | { field: string; format?: string }>;

export type ScriptDefinition = {
  source: string;
  lang?: string;
  params?: Record<string, any>;
};

export type DocumentUpdate = {
  doc?: Record<string, any>;
  script?: ScriptDefinition;
  doc_as_upsert?: boolean;
  scripted_upsert?: boolean;
  upsert?: Record<string, any>;
};
