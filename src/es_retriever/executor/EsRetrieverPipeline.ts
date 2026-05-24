import {EsRetriever} from '../../interface/EsRetriever';
import {EsRetrieverDispatcher} from './EsRetrieverDispatcher';
import {EsRetrieverExecutor} from './EsRetrieverExecutor';
import {RetrieverContext} from './RetrieverContext';
import {RetrieverResult} from './RetrieverResult';

export class EsRetrieverPipeline implements EsRetrieverDispatcher {

    private readonly executors: EsRetrieverExecutor[];

    constructor(executors: EsRetrieverExecutor[]) {
        this.executors = [...executors];
    }

    public register(executor: EsRetrieverExecutor): void {
        this.executors.push(executor);
    }

    public async dispatch(retriever: EsRetriever, context: RetrieverContext): Promise<RetrieverResult> {
        const executor = this.executors.find((candidate) => candidate.canHandle(retriever));
        if (!executor) {
            const typeName = retriever.name?.() ?? 'unknown';
            throw new Error(`No executor registered for retriever type: ${typeName}`);
        }
        return executor.execute(retriever, context, this);
    }
}
