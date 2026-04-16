import { EsQueryDsl } from '../interface/EsQueryDsl';
import { EsRetriever } from '../interface/EsRetriever';

export class BtEsRequestUtil {

    static instanceOfEsQueryDsl(instance: any): instance is EsQueryDsl{
        return (instance as EsQueryDsl).isEsQueryDsl !== undefined;
    }

    static instanceOfEsRetriever(instance: any): instance is EsRetriever{
        return (instance as EsRetriever).isEsRetriever !== undefined;
    }

    static buildQueryParam(query:EsQueryDsl) {
        const result:any = {};
        const stack: Array<{ query: EsQueryDsl, assign: (r: any) => void }> = [
            { query, assign: (r) => Object.assign(result, r) }
        ];

        while (stack.length > 0) {
            const { query: currentQuery, assign } = stack.pop()!;
            const param:any = {};
            let root = null;

            //If Dsl has no _title property
            if (currentQuery.name() === undefined || currentQuery.name() === null) {
                root = currentQuery.body();
                for (let key in root) {
                    if (root.hasOwnProperty(key)) {
                        if (root[key] instanceof Array) {
                            param[key] = [];
                            for (let i = 0 ; i < root[key].length ; i++) {
                                if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                    const arr = param[key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ query: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else {
                                    param[key].push(root[key][i]);
                                }
                            }
                        } else {
                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                                const p = param;
                                const k = key;
                                stack.push({ query: root[key], assign: (r) => { p[k] = r; } });
                            } else {
                                param[key] = root[key];
                            }
                        }
                    }
                }
            } else {
                param[currentQuery.name()] = {};
                root = currentQuery.body()[currentQuery.name()];

                for (let key in root) {
                    if (root.hasOwnProperty(key)) {
                        if (root[key] instanceof Array) {
                            param[currentQuery.name()][key] = [];
                            for (let i = 0 ; i < root[key].length ; i++) {
                                if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                    const arr = param[currentQuery.name()][key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ query: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else {
                                    param[currentQuery.name()][key].push(root[key][i]);
                                }
                            }
                        } else {
                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                                const target = param[currentQuery.name()];
                                const k = key;
                                stack.push({ query: root[key], assign: (r) => { target[k] = r; } });
                            } else {
                                param[currentQuery.name()][key] = root[key];
                            }
                        }
                    }
                }
            }
            assign(param);
        }
        return result;
    }

    static buildAggsParam(aggs:EsQueryDsl) {
        const result:any = {};
        const stack: Array<{ query: EsQueryDsl, assign: (r: any) => void }> = [
            { query: aggs, assign: (r) => Object.assign(result, r) }
        ];

        while (stack.length > 0) {
            const { query: currentAggs, assign } = stack.pop()!;
            const param:any = {};

            param[currentAggs.name()] = {};
            const root = currentAggs.body()[currentAggs.name()];

            for (let key in root) {
                if (root.hasOwnProperty(key)) {
                    if (root[key] instanceof Array) {
                        param[currentAggs.name()][key] = {};
                        for (let i = 0 ; i < root[key].length ; i++) {
                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                const target = param[currentAggs.name()][key];
                                stack.push({ query: root[key][i], assign: (r) => { Object.assign(target, r); } });
                            } else {
                                Object.assign(param[currentAggs.name()][key], root[key][i]);
                            }
                        }
                    } else {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                            const target = param[currentAggs.name()];
                            const k = key;
                            stack.push({ query: root[key], assign: (r) => { target[k] = r; } });
                        } else {
                            param[currentAggs.name()][key] = root[key];
                        }
                    }
                }
            }
            assign(param);
        }
        return result;
    }

    static buildSuggestParam(suggest:EsQueryDsl) {
        const result:any = {};
        const stack: Array<{ query: EsQueryDsl, assign: (r: any) => void }> = [
            { query: suggest, assign: (r) => Object.assign(result, r) }
        ];

        while (stack.length > 0) {
            const { query: currentSuggest, assign } = stack.pop()!;
            const param:any = {};

            param[currentSuggest.name()] = {};
            const root = currentSuggest.body()[currentSuggest.name()];

            for (let key in root) {
                if (root.hasOwnProperty(key)) {
                    if (root[key] instanceof Array) {
                        param[currentSuggest.name()][key] = {};
                        for (let i = 0 ; i < root[key].length ; i++) {
                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                const target = param[currentSuggest.name()][key];
                                stack.push({ query: root[key][i], assign: (r) => { Object.assign(target, r); } });
                            } else {
                                Object.assign(param[currentSuggest.name()][key], root[key][i]);
                            }
                        }
                    } else {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                            const target = param[currentSuggest.name()];
                            const k = key;
                            stack.push({ query: root[key], assign: (r) => { target[k] = r; } });
                        } else {
                            param[currentSuggest.name()][key] = root[key];
                        }
                    }
                }
            }
            assign(param);
        }
        return result;
    }

    static buildRetrieverParam(retriever: EsRetriever) {
        const result: any = {};
        type StackItem =
            | { type: 'retriever'; source: EsRetriever; assign: (r: any) => void }
            | { type: 'queryDsl'; source: EsQueryDsl; assign: (r: any) => void };
        const stack: StackItem[] = [
            { type: 'retriever', source: retriever, assign: (r) => Object.assign(result, r) }
        ];

        while (stack.length > 0) {
            const item = stack.pop()!;

            if (item.type === 'queryDsl') {
                item.assign(BtEsRequestUtil.buildQueryParam(item.source));
                continue;
            }

            const currentRetriever = item.source;
            const assign = item.assign;
            const param: any = {};
            let root = null;

            if (currentRetriever.name() === undefined || currentRetriever.name() === null) {
                root = currentRetriever.body();
                for (let key in root) {
                    if (root.hasOwnProperty(key)) {
                        if (root[key] instanceof Array) {
                            param[key] = [];
                            for (let i = 0; i < root[key].length; i++) {
                                if (BtEsRequestUtil.instanceOfEsRetriever(root[key][i])) {
                                    const arr = param[key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ type: 'retriever', source: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                    const arr = param[key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ type: 'queryDsl', source: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else {
                                    param[key].push(root[key][i]);
                                }
                            }
                        } else {
                            if (BtEsRequestUtil.instanceOfEsRetriever(root[key])) {
                                const p = param;
                                const k = key;
                                stack.push({ type: 'retriever', source: root[key], assign: (r) => { p[k] = r; } });
                            } else if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                                const p = param;
                                const k = key;
                                stack.push({ type: 'queryDsl', source: root[key], assign: (r) => { p[k] = r; } });
                            } else {
                                param[key] = root[key];
                            }
                        }
                    }
                }
            } else {
                param[currentRetriever.name()] = {};
                root = currentRetriever.body()[currentRetriever.name()];

                for (let key in root) {
                    if (root.hasOwnProperty(key)) {
                        if (root[key] instanceof Array) {
                            param[currentRetriever.name()][key] = [];
                            for (let i = 0; i < root[key].length; i++) {
                                if (BtEsRequestUtil.instanceOfEsRetriever(root[key][i])) {
                                    const arr = param[currentRetriever.name()][key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ type: 'retriever', source: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                    const arr = param[currentRetriever.name()][key];
                                    const idx = arr.length;
                                    arr.push(null);
                                    stack.push({ type: 'queryDsl', source: root[key][i], assign: (r) => { arr[idx] = r; } });
                                } else {
                                    param[currentRetriever.name()][key].push(root[key][i]);
                                }
                            }
                        } else {
                            if (BtEsRequestUtil.instanceOfEsRetriever(root[key])) {
                                const target = param[currentRetriever.name()];
                                const k = key;
                                stack.push({ type: 'retriever', source: root[key], assign: (r) => { target[k] = r; } });
                            } else if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                                const target = param[currentRetriever.name()];
                                const k = key;
                                stack.push({ type: 'queryDsl', source: root[key], assign: (r) => { target[k] = r; } });
                            } else {
                                param[currentRetriever.name()][key] = root[key];
                            }
                        }
                    }
                }
            }
            assign(param);
        }
        return result;
    }
}
