import {rrfMerge, validateRrfPagination} from '../../../src/es_retriever/executor/rrfMerge';
import {RankedHit} from '../../../src/es_retriever/executor/RetrieverResult';

function hit(index: string, id: string, score: number = 0, source?: any, highlight?: any): RankedHit {
    return {index, id, score, source, highlight};
}

describe('rrfMerge', () => {

    it('returns empty result when there are no children', () => {
        const result = rrfMerge([], {rankConstant: 60});
        expect(result.rankedIds).toEqual([]);
        expect(result.candidateCount).toBe(0);
    });

    it('returns empty result when all children are empty', () => {
        const result = rrfMerge([{rankedIds: []}, {rankedIds: []}], {rankConstant: 60});
        expect(result.rankedIds).toEqual([]);
        expect(result.candidateCount).toBe(0);
    });

    it('produces RRF scores for a single child preserving order', () => {
        const child = {rankedIds: [hit('docs', 'a', 0.9), hit('docs', 'b', 0.7), hit('docs', 'c', 0.5)]};
        const result = rrfMerge([child], {rankConstant: 60});

        expect(result.rankedIds.map((h) => h.id)).toEqual(['a', 'b', 'c']);
        expect(result.rankedIds[0].score).toBeCloseTo(1 / 61, 10);
        expect(result.rankedIds[1].score).toBeCloseTo(1 / 62, 10);
        expect(result.rankedIds[2].score).toBeCloseTo(1 / 63, 10);
    });

    it('replaces original score with RRF score (ignores child score)', () => {
        const child = {rankedIds: [hit('docs', 'a', 99.99)]};
        const result = rrfMerge([child], {rankConstant: 60});

        expect(result.rankedIds[0].score).toBeCloseTo(1 / 61, 10);
    });

    it('sums contributions for documents present in multiple children', () => {
        const c1 = {rankedIds: [hit('docs', 'a'), hit('docs', 'b')]};
        const c2 = {rankedIds: [hit('docs', 'a'), hit('docs', 'c')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        const a = result.rankedIds.find((h) => h.id === 'a')!;
        const b = result.rankedIds.find((h) => h.id === 'b')!;
        const c = result.rankedIds.find((h) => h.id === 'c')!;

        expect(a.score).toBeCloseTo(1 / 61 + 1 / 61, 10);
        expect(b.score).toBeCloseTo(1 / 62, 10);
        expect(c.score).toBeCloseTo(1 / 62, 10);
    });

    it('places docs that appear in multiple children above singletons', () => {
        const c1 = {rankedIds: [hit('docs', 'a'), hit('docs', 'b')]};
        const c2 = {rankedIds: [hit('docs', 'a'), hit('docs', 'c')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        expect(result.rankedIds[0].id).toBe('a');
        const a = result.rankedIds[0];
        const b = result.rankedIds.find((h) => h.id === 'b')!;
        const c = result.rankedIds.find((h) => h.id === 'c')!;
        expect(a.score).toBeGreaterThan(b.score);
        expect(a.score).toBeGreaterThan(c.score);
    });

    it('keeps documents that appear in only one child', () => {
        const c1 = {rankedIds: [hit('docs', 'a')]};
        const c2 = {rankedIds: [hit('docs', 'b')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        const ids = result.rankedIds.map((h) => h.id).sort();
        expect(ids).toEqual(['a', 'b']);
    });

    it('breaks ties by index/id ascending', () => {
        const c1 = {rankedIds: [hit('docs', 'b')]};
        const c2 = {rankedIds: [hit('docs', 'a')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        expect(result.rankedIds[0].score).toEqual(result.rankedIds[1].score);
        expect(result.rankedIds[0].id).toBe('a');
        expect(result.rankedIds[1].id).toBe('b');
    });

    it('breaks ties on index lexicographically when ids are equal', () => {
        const c1 = {rankedIds: [hit('idx-b', 'same')]};
        const c2 = {rankedIds: [hit('idx-a', 'same')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        expect(result.rankedIds[0].index).toBe('idx-a');
        expect(result.rankedIds[1].index).toBe('idx-b');
    });

    it('treats same id across different indices as separate documents', () => {
        const c1 = {rankedIds: [hit('idx1', 'a'), hit('idx2', 'a')]};
        const result = rrfMerge([c1], {rankConstant: 60});

        expect(result.candidateCount).toBe(2);
        expect(result.rankedIds.map((h) => `${h.index}/${h.id}`).sort())
            .toEqual(['idx1/a', 'idx2/a']);
    });

    it('rankConstant influences score magnitudes (smaller k -> larger top contribution)', () => {
        const child = {rankedIds: [hit('docs', 'a')]};
        const k60 = rrfMerge([child], {rankConstant: 60}).rankedIds[0].score;
        const k10 = rrfMerge([child], {rankConstant: 10}).rankedIds[0].score;

        expect(k10).toBeGreaterThan(k60);
        expect(k60).toBeCloseTo(1 / 61, 10);
        expect(k10).toBeCloseTo(1 / 11, 10);
    });

    it('dedups documents that appear multiple times within a single child (counts first occurrence only)', () => {
        const child = {rankedIds: [hit('docs', 'a'), hit('docs', 'b'), hit('docs', 'a')]};
        const result = rrfMerge([child], {rankConstant: 60});

        expect(result.candidateCount).toBe(2);
        const a = result.rankedIds.find((h) => h.id === 'a')!;
        expect(a.score).toBeCloseTo(1 / 61, 10);
    });

    it('preserves source and highlight from first child encountering the doc', () => {
        const c1 = {rankedIds: [hit('docs', 'a', 0.9, {title: 'A'}, {title: ['<em>A</em>']})]};
        const c2 = {rankedIds: [hit('docs', 'a', 0.5, {title: 'A2'})]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        const a = result.rankedIds.find((h) => h.id === 'a')!;
        expect(a.source).toEqual({title: 'A'});
        expect(a.highlight).toEqual({title: ['<em>A</em>']});
    });

    it('is deterministic - identical inputs produce identical outputs', () => {
        const c1 = {rankedIds: [hit('docs', 'a'), hit('docs', 'b'), hit('docs', 'c')]};
        const c2 = {rankedIds: [hit('docs', 'b'), hit('docs', 'd')]};
        const r1 = rrfMerge([c1, c2], {rankConstant: 60});
        const r2 = rrfMerge([c1, c2], {rankConstant: 60});

        expect(r1).toEqual(r2);
    });

    it('reports candidateCount equal to unique document count', () => {
        const c1 = {rankedIds: [hit('docs', 'a'), hit('docs', 'b')]};
        const c2 = {rankedIds: [hit('docs', 'b'), hit('docs', 'c'), hit('docs', 'd')]};
        const result = rrfMerge([c1, c2], {rankConstant: 60});

        expect(result.candidateCount).toBe(4);
    });
});

describe('validateRrfPagination', () => {

    it('passes when rank_window_size equals from + size (boundary)', () => {
        expect(() => validateRrfPagination(100, 90, 10)).not.toThrow();
    });

    it('passes when rank_window_size exceeds from + size', () => {
        expect(() => validateRrfPagination(200, 0, 10)).not.toThrow();
    });

    it('passes for size 0 with from=0', () => {
        expect(() => validateRrfPagination(10, 0, 0)).not.toThrow();
    });

    it('throws when rank_window_size < from + size', () => {
        expect(() => validateRrfPagination(100, 91, 10))
            .toThrow(/rank_window_size\(100\).*from\(91\).*size\(10\)/);
    });

    it('throws when from alone exceeds rank_window_size', () => {
        expect(() => validateRrfPagination(50, 60, 10))
            .toThrow(/rank_window_size\(50\)/);
    });
});
