
import { Client } from "@elastic/elasticsearch";
import { BtEsConfig } from './interface/BtEsConfig';
import { BtEsAbstractSearchRequest } from './bt_es_request/BtEsAbstractSearchRequest';
import { BtEsAbstractGetRequest } from './bt_es_request/BtEsAbstractGetRequest';
import { BtEsAbstractPutRequest } from './bt_es_request/BtEsAbstractPutRequest';
import { BtEsAbstractUpdateRequest } from './bt_es_request/BtEsAbstractUpdateRequest';
import { BtEsAbstractDeleteRequest } from './bt_es_request/BtEsAbstractDeleteRequest';
import { BtEsAbstractMGetRequest } from "./bt_es_request/BtEsAbstractMGetRequest";
import { BtEsSearchResponse } from "./response/BtEsSearchResponse";
import { BtEsDocumentIndexResponse } from "./response/BtEsDocumentIndexResponse";
import { BtEsGenericResponse } from "./response/BtEsGenericResponse";
import { EsAnalyzeApi } from "./es_indices_api/EsAnalyzeApi";
import { EsSimulatePipelineApi } from "./es_ingest_api/EsSimulatePipelineApi";
import { BtEsGetResponse } from "./response/BtEsGetResponse";
import { BtEsMGetResponse } from "./response/BtEsMGetResponse";
import { BtEsBulkIndexResponse } from "./response/BtEsBulkIndexResponse";

export class BtEsAbstractDao {

    protected esClient: Client;

    constructor(config:BtEsConfig) {
        this.esClient = new Client(config.buildConnectionConfig());
    }

    async createIndex(indexName:string, mapping:any): Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.create({
            index: indexName,
            body:mapping
        });
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async indexExists(indexName:string):Promise<boolean> {
        let response = await this.esClient.indices.exists({index:indexName});
        return response['body'];
    }

    async deleteIndex(indexName:string): Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.delete({index: indexName});
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async getIndexListWithAliasName(aliasName:string):Promise<Array<string>> {
        let response = await this.esClient.indices.getAlias({name: aliasName});
        return Object.keys(response['body']);
    }

    async existsAlias(aliasName:string):Promise<boolean> {
        let response = await this.esClient.indices.existsAlias({name: aliasName});
        return response['body'];
    }

    async putAlias(indexName:string, aliasName:string):Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.putAlias({index:indexName, name: aliasName});
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async exchangeAlias( putIndexList:Array<string>, removeIndexList:Array<string>, aliasName:string):Promise<BtEsGenericResponse> {

        const query:any = { actions:[] };
        for (let putIndexName of putIndexList) {
            query['actions'].push({add: {index: putIndexName, alias:aliasName}});
        }

        for (let removeIndexName of removeIndexList) {
            query['actions'].push({remove: {index: removeIndexName, alias:aliasName}});
        }

        let response = await this.esClient.indices.updateAliases({body:query});
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async deleteAlias(indexName:string, aliasName:string): Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.deleteAlias({index:indexName, name: aliasName});
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async createTemplate(templateName:string, template:any): Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.putTemplate(
            {
                name: templateName,
                body: template
            }
        );
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async deleteTemplate(templateName:string): Promise<BtEsGenericResponse> {
        let response = await this.esClient.indices.deleteTemplate(
            {
                name: templateName,
            }
        );
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async requestAnalyze(analyzeRequest:EsAnalyzeApi):Promise<Array<any>> {

        let response = await this.esClient.indices.analyze(analyzeRequest.buildRequest());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return response['body']['tokens'];
    }

    async ingestSimulate(simulateRequest:EsSimulatePipelineApi):Promise<any> {
        let response = await this.esClient.ingest.simulate(simulateRequest.buildRequest());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return response['body'];
    }

    async requestSearch(request:BtEsAbstractSearchRequest):Promise<BtEsSearchResponse> {

        let response = await this.esClient.search(request.getRequestParam());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsSearchResponse(response['body'], <number>response['statusCode']);
    }

    async requestScroll(scrollId:string, scrollTimeout:string):Promise<BtEsSearchResponse> {

        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        let param = {
            scroll_id: scrollId,
            scroll: scrollTimeout
        };

        let response = await this.esClient.scroll(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsSearchResponse(response['body'], <number>response['statusCode']);
    }

    async deleteScroll(scrollId:string | Array<string>):Promise<BtEsGenericResponse> {
        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        let param = {
            scroll_id: scrollId
        };

        let response = await this.esClient.clearScroll(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsGenericResponse(response['body'], <number>response['statusCode']);
    }

    async requestGet(request:BtEsAbstractGetRequest):Promise<BtEsGetResponse> {
        let response = await this.esClient.get(request.getRequestParam());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsGetResponse(response['body'], <number>response['statusCode']);
    }

    async requestMGet(request:BtEsAbstractMGetRequest):Promise<BtEsMGetResponse> {

        let response = await this.esClient.mget(request.getRequestParam());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsMGetResponse(response['body'], <number>response['statusCode']);
    }

    async requestPut(request:BtEsAbstractPutRequest, document:any):Promise<BtEsDocumentIndexResponse> {

        let param: any = {};
        Object.assign(param, request.getRequestParam());

        //set Id
        if (document.hasOwnProperty('id')) {
            param['id'] = document['id'];
        } else if (!param['id']) {
            delete param['id'];
        }

        //set document
        param['body'] = document;

        let opType = null;
        if (request.hasOwnProperty('opType')) {
            opType = request.getOpType();
        }

        let response = null;
        if (opType === 'create') {
            response = await this.esClient.create(param);
        } else {
            response = await this.esClient.index(param);
        }

        console.log('PUT RESPONSE:', JSON.stringify(response, null, 2));
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsDocumentIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestUpdate(request:BtEsAbstractUpdateRequest):Promise<BtEsDocumentIndexResponse> {

        let param:any = {};
        Object.assign(param, request.getRequestParam());
        let response = await this.esClient.update(param );
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsDocumentIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestUpdateByQuery(request:BtEsAbstractUpdateRequest):Promise<BtEsDocumentIndexResponse> {

        let param:any = {};
        Object.assign(param, request.getRequestParam());
        let response = await this.esClient.updateByQuery(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsDocumentIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestDelete(request:BtEsAbstractDeleteRequest ):Promise<BtEsDocumentIndexResponse> {

        let response = await this.esClient.delete(request.getRequestParam());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsDocumentIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestPutBulk(request:BtEsAbstractPutRequest, documents:Array<any>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
        Object.assign(param, request.getRequestParam());
        param['body'] = [];

        //Check routing
        let routingField = null;
        if (param.hasOwnProperty('routingField')) {
            routingField = param['routingField'];
            delete param['routingField'];
        }

        //Check op type
        let opType = null;

        if (param.hasOwnProperty('opType')) {
            opType = param['opType'];
            delete param['opType'];
        }

        for (let i = 0 ; i < documents.length ; i++) {
            let document = documents[i];
            let item:any = {};

            item['_index'] = request.getIndex();
            item['_type'] = request.getType();

            if (routingField !== null) {
                item['routing'] = document[routingField];
            }

            if (document.hasOwnProperty('id')) {
                item['_id'] = document.id;
            }

            if (opType === 'create') {
                param['body'].push({'create': item});
            } else {
                param['body'].push({'index': item});
            }

            param['body'].push(document);
        }

        response = await this.esClient.bulk(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsBulkIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestUpdateBulk(request:BtEsAbstractPutRequest, documents:Array<any>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
        Object.assign(param, request.getRequestParam());
        param['body'] = [];

        //Check routing
        let routingField = null;
        if (param.hasOwnProperty('routingField')) {
            routingField = param['routingField'];
            delete param['routingField'];
        }

        for (let i = 0 ; i < documents.length ; i++) {
            let document = documents[i];
            let item:any = {};

            item['_index'] = request.getIndex();
            item['_type'] = request.getType();

            if (routingField !== null) {
                item['routing'] = document[routingField];
            }

            if (document.hasOwnProperty('id')) {
                item['_id'] = document.id;
            }
            param['body'].push({'update': item});
            param['body'].push({'doc': document});
        }

        response = await this.esClient.bulk(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsBulkIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestDeleteBulk(request:BtEsAbstractDeleteRequest, docIds:Array<number|string>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
        Object.assign(param, request.getRequestParam());
        param['body'] = [];

        //Check op type
        for (let i = 0 ; i < docIds.length ; i++) {
            let item:any = {};

            item['_index'] = request.getIndex();
            item['_type'] = request.getType();
            item['_id'] = docIds[i];
            param['body'].push({'delete': item});
        }
        response = await this.esClient.bulk(param);
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsBulkIndexResponse(response['body'], <number>response['statusCode']);
    }

    async requestDeleteByQuery(request:BtEsAbstractSearchRequest):Promise<BtEsDocumentIndexResponse> {
        let response = await this.esClient.deleteByQuery(request.getRequestParam());
        if (response['body'] && response['body']['error']) {
            return Promise.reject(response['body']['error']);
        }
        return new BtEsDocumentIndexResponse(response['body'], <number>response['statusCode']);
    }
}

