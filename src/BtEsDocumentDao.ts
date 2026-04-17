'use strict';

import { BtEsAbstractDao } from './BtEsAbstractDao';
import { BtEsAbstractGetRequest } from './bt_es_request/BtEsAbstractGetRequest';
import { BtEsAbstractPutRequest } from './bt_es_request/BtEsAbstractPutRequest';
import { BtEsAbstractUpdateRequest } from './bt_es_request/BtEsAbstractUpdateRequest';
import { BtEsAbstractDeleteRequest } from './bt_es_request/BtEsAbstractDeleteRequest';
import { BtEsAbstractMGetRequest } from "./bt_es_request/BtEsAbstractMGetRequest";
import { BtEsAbstractDeleteByQueryRequest } from './bt_es_request/BtEsAbstractDeleteByQueryRequest';
import { BtEsDocumentIndexResponse } from "./response/BtEsDocumentIndexResponse";
import { BtEsGetResponse } from "./response/BtEsGetResponse";
import { BtEsMGetResponse } from "./response/BtEsMGetResponse";
import { BtEsBulkIndexResponse } from "./response/BtEsBulkIndexResponse";
import { BtEsDeleteByQueryResponse } from './response/BtEsDeleteByQueryResponse';
import { BtEsUpdateByQueryResponse } from './response/BtEsUpdateByQueryResponse';

export class BtEsDocumentDao extends BtEsAbstractDao {

    public async requestGet(request: BtEsAbstractGetRequest): Promise<BtEsGetResponse> {
        const response = await this.esClient.get(request.getParam());
        return new BtEsGetResponse(response);
    }

    public async requestMGet(request: BtEsAbstractMGetRequest): Promise<BtEsMGetResponse> {
        const response = await this.esClient.mget(request.getParam());
        return new BtEsMGetResponse(response);
    }

    public async requestPut<T = any>(request: BtEsAbstractPutRequest, document: T): Promise<BtEsDocumentIndexResponse> {
        let param: any = {};
        Object.assign(param, request.getParam());

        //set Id
        if ((document as any).hasOwnProperty('id')) {
            param['id'] = (document as any)['id'];
        } else if (!param['id']) {
            delete param['id'];
        }

        //set document
        param['body'] = document;

        let opType = null;
        if (request.hasOwnProperty('op_type')) {
            opType = request.opType;
        }

        let response = null;
        if (opType === 'create') {
            response = await this.esClient.create(param);
        } else {
            response = await this.esClient.index(param);
        }

        return new BtEsDocumentIndexResponse(response);
    }

    public async requestUpdate(request: BtEsAbstractUpdateRequest): Promise<BtEsDocumentIndexResponse> {
        let param: any = {};
        Object.assign(param, request.getParam());
        const response = await this.esClient.update(param);
        return new BtEsDocumentIndexResponse(response);
    }

    public async requestUpdateByQuery(request: BtEsAbstractUpdateRequest): Promise<BtEsUpdateByQueryResponse> {
        let param: any = {};
        Object.assign(param, request.getParam());
        const response = await this.esClient.updateByQuery(param);
        return new BtEsUpdateByQueryResponse(response);
    }

    public async requestDelete(request: BtEsAbstractDeleteRequest): Promise<BtEsDocumentIndexResponse> {
        const response = await this.esClient.delete(request.getParam());
        return new BtEsDocumentIndexResponse(response);
    }

    public async requestPutBulk<T = any>(request: BtEsAbstractPutRequest, documents: Array<T>): Promise<BtEsBulkIndexResponse> {
        let response = null;
        let param: any = {};
        Object.assign(param, request.getParam());
        param['body'] = [];

        //Check routing
        let routingField = null;
        if (param.hasOwnProperty('routing')) {
            routingField = param['routing'];
            delete param['routing'];
        }

        //Check op type
        let opType = null;

        if (param.hasOwnProperty('op_type')) {
            opType = param['op_type'];
            delete param['op_type'];
        }

        for (let i = 0; i < documents.length; i++) {
            let document = documents[i];
            let item: any = {};

            item['_index'] = request.index;

            if (routingField !== null) {
                item['routing'] = (document as any)[routingField];
            }

            if ((document as any).hasOwnProperty('id')) {
                item['_id'] = (document as any).id;
            }

            if (opType === 'create') {
                param['body'].push({ 'create': item });
            } else {
                param['body'].push({ 'index': item });
            }

            param['body'].push(document);
        }

        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestUpdateBulk<T = any>(request: BtEsAbstractPutRequest, documents: Array<T>): Promise<BtEsBulkIndexResponse> {
        let response = null;
        let param: any = {};
        Object.assign(param, request.getParam());
        param['body'] = [];

        //Check routing
        let routingField = null;
        if (param.hasOwnProperty('routing')) {
            routingField = param['routing'];
            delete param['routing'];
        }

        //Check op type
        if (param.hasOwnProperty('op_type')) {
            delete param['op_type'];
        }

        for (let i = 0; i < documents.length; i++) {
            let document = documents[i];
            let item: any = {};

            item['_index'] = request.index;

            if (routingField !== null) {
                item['routing'] = (document as any)[routingField];
            }

            if ((document as any).hasOwnProperty('id')) {
                item['_id'] = (document as any).id;
            }
            param['body'].push({ 'update': item });
            param['body'].push({ 'doc': document });
        }

        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestDeleteBulk(request: BtEsAbstractDeleteRequest, docIds: Array<number | string>): Promise<BtEsBulkIndexResponse> {
        let response = null;
        let param: any = {};
        Object.assign(param, request.getParam());
        param['body'] = [];

        for (let i = 0; i < docIds.length; i++) {
            let item: any = {};

            item['_index'] = request.index;
            item['_id'] = docIds[i];
            param['body'].push({ 'delete': item });
        }
        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestDeleteByQuery(request: BtEsAbstractDeleteByQueryRequest): Promise<BtEsDeleteByQueryResponse> {
        const response = await this.esClient.deleteByQuery(request.getParam());
        return new BtEsDeleteByQueryResponse(response);
    }
}
