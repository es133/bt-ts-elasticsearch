import { EsQueryDsl } from '../interface/EsQueryDsl';

export class BtEsRequestUtil {

    static instanceOfEsQueryDsl(instance: any): instance is EsQueryDsl{
        return (instance as EsQueryDsl).isEsQueryDsl !== undefined;
    }

    static buildQueryParam(query:EsQueryDsl) {
        let param:any = {};
        let root =  null;

        //If Dsl has no _title property
        if (query.name() === undefined || query.name() === null) {
            root = query.body();
            for (let key in root) {
                if (root.hasOwnProperty(key)) {
                    if (root[key] instanceof Array) {
                        param[key] = [];
                        for (let i = 0 ; i < root[key].length ; i++) {

                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                param[key].push(BtEsRequestUtil.buildQueryParam(root[key][i]));
                            } else {
                                param[key].push(root[key][i]);
                            }
                        }
                    } else {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                            param[key] = BtEsRequestUtil.buildQueryParam(root[key]);
                        } else {
                            param[key] = root[key];
                        }
                    }
                }
            }
        } else {
            param[query.name()] = {};
            root = query.body()[query.name()];

            for (let key in root) {
                if (root.hasOwnProperty(key)) {
                    if (root[key] instanceof Array) {
                        //param[query._title][key] = [];
                        param[query.name()][key] = [];
                        for (let i = 0 ; i < root[key].length ; i++) {
                            if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                                param[query.name()][key].push(BtEsRequestUtil.buildQueryParam(root[key][i]));
                            } else {
                                param[query.name()][key].push(root[key][i]);
                            }
                        }
                    } else {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                            param[query.name()][key] = BtEsRequestUtil.buildQueryParam(root[key]);
                        } else {
                            param[query.name()][key] = root[key];
                        }
                    }
                }
            }
        }
        return param;
    }

    static buildAggsParam(aggs:EsQueryDsl) {
        let param:any = {};

        param[aggs.name()] = {};
        let root = aggs.body()[aggs.name()];

        for (let key in root) {
            if (root.hasOwnProperty(key)) {
                if (root[key] instanceof Array) {
                    param[aggs.name()][key] = {};
                    for (let i = 0 ; i < root[key].length ; i++) {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i]) ) {
                            Object.assign(param[aggs.name()][key], BtEsRequestUtil.buildAggsParam(root[key][i]));
                        } else {
                            Object.assign(param[aggs.name()][key], root[key][i]);
                        }
                    }
                } else {
                    if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                        param[aggs.name()][key] = BtEsRequestUtil.buildAggsParam(root[key]);
                    } else {
                        param[aggs.name()][key] = root[key];
                    }
                }
            }
        }
        return param;
    }

    static buildSuggestParam(suggest:EsQueryDsl) {

        let param:any = {};

        param[suggest.name()] = {};
        let root = suggest.body()[suggest.name()];

        for (let key in root) {
            if (root.hasOwnProperty(key)) {
                if (root[key] instanceof Array) {
                    param[suggest.name()][key] = {};
                    for (let i = 0 ; i < root[key].length ; i++) {
                        if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key][i])) {
                            Object.assign(param[suggest.name()][key], BtEsRequestUtil.buildSuggestParam(root[key][i]));
                        } else {
                            Object.assign(param[suggest.name()][key], root[key][i]);
                        }
                    }
                } else {
                    if (BtEsRequestUtil.instanceOfEsQueryDsl(root[key])) {
                        param[suggest.name()][key] = BtEsRequestUtil.buildSuggestParam(root[key]);
                    } else {
                        param[suggest.name()][key] = root[key];
                    }
                }
            }
        }
        return param;
    }
}
