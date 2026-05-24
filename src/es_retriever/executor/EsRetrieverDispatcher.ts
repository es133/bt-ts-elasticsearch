import {EsRetriever} from '../../interface/EsRetriever';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult} from './RetrieverResult';

export interface EsRetrieverDispatcher {
    dispatch(retriever: EsRetriever, context: RetrieverContext): Promise<RetrieverResult>;
}
