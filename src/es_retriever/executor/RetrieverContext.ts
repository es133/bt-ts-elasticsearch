import {EsQueryDsl} from '../../interface/EsQueryDsl';
import {EsClientPort} from './EsClientPort';

export type RetrieverContext = {
    client: EsClientPort;
    index: string | string[];
    from: number;
    size: number;
    trackTotalHits: boolean | number;
    sort?: Record<string, any>;
    postFilter?: EsQueryDsl;
    source?: boolean | string | string[] | { includes?: string[]; excludes?: string[] };
    highlight?: Record<string, any>;
    searchAfter?: Array<string | number>;
    parentFilter?: EsQueryDsl | EsQueryDsl[];
    aggregations?: Record<string, any>;
};
