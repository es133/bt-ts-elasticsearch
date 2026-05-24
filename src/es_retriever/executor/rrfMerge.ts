import {RankedHit} from './RetrieverResult';

export type ChildRanking = {
    rankedIds: RankedHit[];
};

export type RrfMergeOptions = {
    rankConstant: number;
};

export type RrfMergeResult = {
    rankedIds: RankedHit[];
    candidateCount: number;
};

function docKey(hit: RankedHit): string {
    return `${hit.index}/${hit.id}`;
}

export function rrfMerge(children: ChildRanking[], options: RrfMergeOptions): RrfMergeResult {
    const scoreMap = new Map<string, number>();
    const docMap = new Map<string, RankedHit>();

    for (const child of children) {
        const seenInChild = new Set<string>();
        for (let rank = 0; rank < child.rankedIds.length; rank++) {
            const hit = child.rankedIds[rank];
            const key = docKey(hit);
            if (seenInChild.has(key)) {
                continue;
            }
            seenInChild.add(key);

            const contribution = 1 / (options.rankConstant + rank + 1);
            scoreMap.set(key, (scoreMap.get(key) ?? 0) + contribution);

            if (!docMap.has(key)) {
                docMap.set(key, hit);
            }
        }
    }

    const merged: RankedHit[] = [];
    scoreMap.forEach((score, key) => {
        const doc = docMap.get(key) as RankedHit;
        merged.push({
            id: doc.id,
            index: doc.index,
            score,
            source: doc.source,
            highlight: doc.highlight,
        });
    });

    merged.sort((a, b) => {
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        const ka = docKey(a);
        const kb = docKey(b);
        if (ka < kb) return -1;
        if (ka > kb) return 1;
        return 0;
    });

    return {
        rankedIds: merged,
        candidateCount: merged.length,
    };
}

export function validateRrfPagination(rankWindowSize: number, from: number, size: number): void {
    const required = from + size;
    if (rankWindowSize < required) {
        throw new Error(
            `rank_window_size(${rankWindowSize}) must be >= from(${from}) + size(${size}) for rrf retriever. ` +
            `Increase rank_window_size or narrow pagination.`
        );
    }
}
