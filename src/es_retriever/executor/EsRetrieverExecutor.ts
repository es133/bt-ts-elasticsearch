import {EsRetriever} from '../../interface/EsRetriever';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult} from './RetrieverResult';
import {EsRetrieverDispatcher} from './EsRetrieverDispatcher';

export interface EsRetrieverExecutor {
    canHandle(retriever: EsRetriever): boolean;
    execute(retriever: EsRetriever, context: RetrieverContext, dispatcher: EsRetrieverDispatcher): Promise<RetrieverResult>;
}
