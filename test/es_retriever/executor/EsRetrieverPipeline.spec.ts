import {EsRetrieverPipeline} from '../../../src/es_retriever/executor/EsRetrieverPipeline';
import {EsRetrieverExecutor} from '../../../src/es_retriever/executor/EsRetrieverExecutor';
import {EsRetrieverDispatcher} from '../../../src/es_retriever/executor/EsRetrieverDispatcher';
import {RetrieverContext} from '../../../src/es_retriever/executor/RetrieverContext';
import {RetrieverResult} from '../../../src/es_retriever/executor/RetrieverResult';
import {EsClientPort} from '../../../src/es_retriever/executor/EsClientPort';
import {EsRetriever} from '../../../src/interface/EsRetriever';

class FakeRetriever implements EsRetriever {
    constructor(private readonly _name: string) {}
    name(): string { return this._name; }
    body(): Record<string, any> { return {[this._name]: {}}; }
    isEsRetriever(): boolean { return true; }
}

class RecordingExecutor implements EsRetrieverExecutor {
    public calls: Array<{retriever: EsRetriever, context: RetrieverContext, dispatcher: EsRetrieverDispatcher}> = [];

    constructor(
        private readonly handles: (r: EsRetriever) => boolean,
        private readonly result: RetrieverResult
    ) {}

    canHandle(retriever: EsRetriever): boolean {
        return this.handles(retriever);
    }

    async execute(retriever: EsRetriever, context: RetrieverContext, dispatcher: EsRetrieverDispatcher): Promise<RetrieverResult> {
        this.calls.push({retriever, context, dispatcher});
        return this.result;
    }
}

const noopClient: EsClientPort = {
    search: async () => ({}),
    msearch: async () => ({}),
    mget: async () => ({}),
};

function makeContext(overrides: Partial<RetrieverContext> = {}): RetrieverContext {
    return {
        client: noopClient,
        index: 'test-index',
        from: 0,
        size: 10,
        trackTotalHits: true,
        ...overrides,
    };
}

function makeResult(value: number = 0): RetrieverResult {
    return {
        rankedIds: [],
        total: {value, relation: 'eq'},
    };
}

describe('EsRetrieverPipeline', () => {

    describe('dispatch', () => {
        it('should dispatch to the executor whose canHandle returns true', async () => {
            const standardResult = makeResult(1);
            const knnResult = makeResult(2);
            const standardExec = new RecordingExecutor((r) => r.name() === 'standard', standardResult);
            const knnExec = new RecordingExecutor((r) => r.name() === 'knn', knnResult);

            const pipeline = new EsRetrieverPipeline([standardExec, knnExec]);
            const ctx = makeContext();

            const result = await pipeline.dispatch(new FakeRetriever('knn'), ctx);

            expect(result).toBe(knnResult);
            expect(knnExec.calls).toHaveLength(1);
            expect(standardExec.calls).toHaveLength(0);
        });

        it('should pass the same context object through to the executor', async () => {
            const exec = new RecordingExecutor(() => true, makeResult());
            const pipeline = new EsRetrieverPipeline([exec]);
            const ctx = makeContext({from: 5, size: 3});

            await pipeline.dispatch(new FakeRetriever('standard'), ctx);

            expect(exec.calls[0].context).toBe(ctx);
            expect(exec.calls[0].context.from).toBe(5);
            expect(exec.calls[0].context.size).toBe(3);
        });

        it('should pass itself as the dispatcher to the executor', async () => {
            const exec = new RecordingExecutor(() => true, makeResult());
            const pipeline = new EsRetrieverPipeline([exec]);

            await pipeline.dispatch(new FakeRetriever('standard'), makeContext());

            expect(exec.calls[0].dispatcher).toBe(pipeline);
        });

        it('should return the executor result unchanged', async () => {
            const expected = makeResult(42);
            const exec = new RecordingExecutor(() => true, expected);
            const pipeline = new EsRetrieverPipeline([exec]);

            const result = await pipeline.dispatch(new FakeRetriever('standard'), makeContext());

            expect(result).toBe(expected);
        });

        it('should select the first matching executor when multiple can handle', async () => {
            const firstResult = makeResult(1);
            const secondResult = makeResult(2);
            const firstExec = new RecordingExecutor(() => true, firstResult);
            const secondExec = new RecordingExecutor(() => true, secondResult);

            const pipeline = new EsRetrieverPipeline([firstExec, secondExec]);

            const result = await pipeline.dispatch(new FakeRetriever('rrf'), makeContext());

            expect(result).toBe(firstResult);
            expect(firstExec.calls).toHaveLength(1);
            expect(secondExec.calls).toHaveLength(0);
        });

        it('should throw a descriptive error when no executor can handle the retriever', async () => {
            const exec = new RecordingExecutor((r) => r.name() === 'standard', makeResult());
            const pipeline = new EsRetrieverPipeline([exec]);

            await expect(pipeline.dispatch(new FakeRetriever('rrf'), makeContext()))
                .rejects.toThrow(/No executor.*rrf/);
        });

        it('should throw when no executors are registered at all', async () => {
            const pipeline = new EsRetrieverPipeline([]);

            await expect(pipeline.dispatch(new FakeRetriever('standard'), makeContext()))
                .rejects.toThrow(/No executor/);
        });

        it('should propagate errors thrown by the executor', async () => {
            const failingExec: EsRetrieverExecutor = {
                canHandle: () => true,
                execute: async () => { throw new Error('boom'); },
            };
            const pipeline = new EsRetrieverPipeline([failingExec]);

            await expect(pipeline.dispatch(new FakeRetriever('standard'), makeContext()))
                .rejects.toThrow('boom');
        });
    });

    describe('register', () => {
        it('should append a new executor to the registry', async () => {
            const lateResult = makeResult(7);
            const lateExec = new RecordingExecutor(() => true, lateResult);

            const pipeline = new EsRetrieverPipeline([]);
            pipeline.register(lateExec);

            const result = await pipeline.dispatch(new FakeRetriever('custom'), makeContext());
            expect(result).toBe(lateResult);
        });
    });
});
