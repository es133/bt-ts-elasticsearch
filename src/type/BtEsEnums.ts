export enum BT_ES_CONFIG_KEY  {
    HOSTS = 'hosts',
    HTTP_AUTH = 'httpAuth',
    LOG = 'log',
    API_VERSION = 'apiVersion',
    MAX_RETRIES = 'maxRetries',
    REQUEST_TIMEOUT = 'requestTimeout',
    MAX_SOCKETS = 'maxSockets',
    KEEP_ALIVE = 'keepAlive',
    KEEP_ALIVE_INTERVAL = 'keepAliveInterval'
}

export enum BT_ES_SORT_ORDER {
    ASC = 'asc',
    DESC = 'desc'
}

export enum BT_ES_INDEX_OP_TYPE {
    CREATE = 'create',
    INDEX = 'index'
}

export enum BT_ES_QUERY_LOGIC_OPERATOR {
    OR = 'OR',
    AND = 'AND'
}

export enum BT_ES_UPDATE_CONFLICT_POLICY {
    ABORT = 'abort',
    PROCEED = 'proceed'
}

export enum HTTP_METHOD  {
    GET = 'GET',
    POST = 'POST'
}

export enum BT_ES_VERSION_TYPE {
    INTERNAL ='internal',
    EXTERNAL = 'external',
    EXTERNAL_GTE = 'external_gte',
    FORCE = 'force'
}

export enum BT_ES_SEARCH_TYPE {
    QUERY_THEN_FETCH = 'query_then_fetch',
    DFS_QUERY_THEN_FETCH = 'dfs_query_then_fetch'
}

export enum BT_ES_QUERY_PARAM {
    INDEX = 'index',
    TYPE = 'type',
    SOURCE = '_source',
    VERSION = 'version',
    SEARCH_TYPE = 'search_type',
    SIZE = 'size',
    FROM = 'from',
    EXPLAIN = 'explain',
    BODY = 'body',
    TIMEOUT = 'timeout',
    SCRIPT_FIELDS = 'script_fields',
    DOC_VALUE_FIELDS = 'docvalue_fields',
    QUERY = 'query',
    ORGANIC = 'organic',
    AGGS = 'aggs',
    SCROLL = 'scroll',
    TRACK_TOTAL_HITS ='track_total_hits',
    STORED_FIELDS = 'stored_fields',
    SOURCE_INCLUDES = '_source_includes',
    SOURCE_EXCLUDES = '_source_excludes'
}

export const BT_ES_SEARCH_DEFAULT_SIZE = 10;

export enum BT_ES_DISTANCE_UNIT {
    Mile = 'miles',
    Yard = 'yards',
    Feet = 'feet',
    Inch = 'inch',
    Kilometer = 'kilometers',
    Meter = 'meters',
    Centimeter = 'centimeters',
    Millimeter = 'millimeters',
    NauticalMile = 'nauticalmiles'
}

export enum BT_ES_TIME_UNIT {
    Days = 'd',
    Hours = 'h',
    Minutes = 'm',
    Seconds = 's',
    Milliseconds = 'ms',
    Microseconds = 'micros',
    Nanoseconds = 'nanos'
}

export enum BT_ES_SCORE_CALC_MODE {
    MULTIPLY = 'multiply',
    SUM = 'sum',
    AVG = 'avg',
    FIRST = 'first',
    MAX = 'max',
    MIN = 'min'
}

export enum BT_ES_RELEVANCE_SCORE_MODE {
    NONE= 'none',
    AVG = 'avg',
    MAX = 'max',
    MIN = 'min',
    SUM = 'sum'
}

export enum BT_ES_MULTIMATCH_TYPE {
    BEST = 'best_fields',
    MOST = 'most_fields',
    CROSS = 'cross_fields',
    PHRASE = 'phrase',
    PHRASE_PREFIX = 'phrase_prefix',
    BOOL_PREFIX = 'bool_prefix'
}
