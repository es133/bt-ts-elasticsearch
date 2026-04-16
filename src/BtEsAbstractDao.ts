
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
import { BtIndicesAnalyzeToken } from './type/BtEsResponseType';
import {BtEsAbstractDeleteByQueryRequest} from './bt_es_request/BtEsAbstractDeleteByQueryRequest';
import {BtEsDeleteByQueryResponse} from './response/BtEsDeleteByQueryResponse';
import {BtEsUpdateByQueryResponse} from './response/BtEsUpdateByQueryResponse';

export class BtEsAbstractDao {

    protected esClient: Client;

    constructor(config:BtEsConfig) {
        this.esClient = new Client(config.buildConnectionConfig());
    }

    public async createIndex(indexName:string, mapping:any, setting: any): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.create({
            index: indexName,
            mappings: mapping,
            settings: setting
        });
        return new BtEsGenericResponse(response);
    }

    public async clientBulkApi(operations:any): Promise<BtEsGenericResponse> {
        return await this.esClient.bulk({refresh: true, operations: operations});
    }

    public async indexExists(indexName:string):Promise<boolean> {
        return await this.esClient.indices.exists({index:indexName});
    }

    public async deleteIndex(indexName:string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.delete({index: indexName});
        return new BtEsGenericResponse(response);
    }

    public async getIndexListWithAliasName(aliasName:string):Promise<Array<string>> {
        const response = await this.esClient.indices.getAlias({name: aliasName});
        return Object.keys(response);
    }

    public async existsAlias(aliasName:string):Promise<boolean> {
        return await this.esClient.indices.existsAlias({name: aliasName});
    }

    public async putAlias(indexName:string, aliasName:string):Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.putAlias({index:indexName, name: aliasName});
        return new BtEsGenericResponse(response);
    }

    public async exchangeAlias( putIndexList:Array<string>, removeIndexList:Array<string>, aliasName:string):Promise<BtEsGenericResponse> {

        const query:any = { actions:[] };
        for (let putIndexName of putIndexList) {
            query['actions'].push({add: {index: putIndexName, alias:aliasName}});
        }

        for (let removeIndexName of removeIndexList) {
            query['actions'].push({remove: {index: removeIndexName, alias:aliasName}});
        }

        let response = await this.esClient.indices.updateAliases(query);
        return new BtEsGenericResponse(response);
    }

    public async deleteAlias(indexName:string, aliasName:string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.deleteAlias({index:indexName, name: aliasName});
        return new BtEsGenericResponse(response);
    }

    public async createIndexTemplate(templateName: string, template: any): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.putIndexTemplate({
            name: templateName,
            body: template
        });
        return new BtEsGenericResponse(response);
    }

    public async deleteIndexTemplate(templateName:string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.deleteIndexTemplate({ name: templateName });
        return new BtEsGenericResponse(response);
    }

    public async requestAnalyze(analyzeRequest:EsAnalyzeApi):Promise<BtIndicesAnalyzeToken[] | undefined> {
        const response = await this.esClient.indices.analyze(analyzeRequest.buildRequest());
        return response.tokens;
    }

    public async ingestSimulate(simulateRequest:EsSimulatePipelineApi):Promise<any> {
        const response = await this.esClient.ingest.simulate(simulateRequest.buildRequest());
        return response;
    }

    public async requestSearch<T = unknown>(request:BtEsAbstractSearchRequest):Promise<BtEsSearchResponse<T>> {

        const response = await this.esClient.search(request.getParam());
        return new BtEsSearchResponse(response);
    }

    public async requestScroll<T = unknown>(scrollId:string, scrollTimeout:string):Promise<BtEsSearchResponse<T>> {

        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        const param = {
            scroll_id: scrollId,
            scroll: scrollTimeout
        };

        const response = await this.esClient.scroll(param);
        return new BtEsSearchResponse(response);
    }

    public async deleteScroll(scrollId:string | Array<string>):Promise<BtEsGenericResponse> {
        if (scrollId === undefined || scrollId === null) {
            return Promise.reject('Invalid parameter');
        }

        let param = {
            scroll_id: scrollId
        };

        let response = await this.esClient.clearScroll(param);
        return new BtEsGenericResponse(response);
    }

    public async openPointInTime(request: any): Promise<string> {
        const response = await this.esClient.openPointInTime(request);
        return response?.id;
    }

    public async requestGet(request:BtEsAbstractGetRequest):Promise<BtEsGetResponse> {
        const response = await this.esClient.get(request.getParam());
        return new BtEsGetResponse(response);
    }

    public async requestMGet(request:BtEsAbstractMGetRequest):Promise<BtEsMGetResponse> {

        const response = await this.esClient.mget(request.getParam());
        return new BtEsMGetResponse(response);
    }

    public async requestPut<T = any>(request:BtEsAbstractPutRequest, document:T):Promise<BtEsDocumentIndexResponse> {

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

        //console.log('PUT RESPONSE:', JSON.stringify(response, null, 2));
        return new BtEsDocumentIndexResponse(response);
    }

    public async requestUpdate(request:BtEsAbstractUpdateRequest):Promise<BtEsDocumentIndexResponse> {

        let param:any = {};
        Object.assign(param, request.getParam());
        const response = await this.esClient.update(param );
        return new BtEsDocumentIndexResponse(response);
    }

    public async requestUpdateByQuery(request:BtEsAbstractUpdateRequest):Promise<BtEsUpdateByQueryResponse> {

        let param:any = {};
        Object.assign(param, request.getParam());
        const response = await this.esClient.updateByQuery(param);
        return new BtEsUpdateByQueryResponse(response);
    }

    public async requestDelete(request:BtEsAbstractDeleteRequest ):Promise<BtEsDocumentIndexResponse> {

        const response = await this.esClient.delete(request.getParam());
        return new BtEsDocumentIndexResponse(response);
    }

    public async requestPutBulk<T = any>(request:BtEsAbstractPutRequest, documents:Array<T>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
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

        for (let i = 0 ; i < documents.length ; i++) {
            let document = documents[i];
            let item:any = {};

            item['_index'] = request.index;

            if (routingField !== null) {
                item['routing'] = (document as any)[routingField];
            }

            if ((document as any).hasOwnProperty('id')) {
                item['_id'] = (document as any).id;
            }

            if (opType === 'create') {
                param['body'].push({'create': item});
            } else {
                param['body'].push({'index': item});
            }

            param['body'].push(document);
        }

        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestUpdateBulk<T = any>(request:BtEsAbstractPutRequest, documents:Array<T>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
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

        for (let i = 0 ; i < documents.length ; i++) {
            let document = documents[i];
            let item:any = {};

            item['_index'] = request.index;

            if (routingField !== null) {
                item['routing'] = (document as any)[routingField];
            }

            if ((document as any).hasOwnProperty('id')) {
                item['_id'] = (document as any).id;
            }
            param['body'].push({'update': item});
            param['body'].push({'doc': document});
        }

        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestDeleteBulk(request:BtEsAbstractDeleteRequest, docIds:Array<number|string>):Promise<BtEsBulkIndexResponse> {

        let response = null;
        let param:any = {};
        Object.assign(param, request.getParam());
        param['body'] = [];

        //Check op type
        for (let i = 0 ; i < docIds.length ; i++) {
            let item:any = {};

            item['_index'] = request.index;
            item['_id'] = docIds[i];
            param['body'].push({'delete': item});
        }
        response = await this.esClient.bulk(param);
        return new BtEsBulkIndexResponse(response);
    }

    public async requestDeleteByQuery(request:BtEsAbstractDeleteByQueryRequest):Promise<BtEsDeleteByQueryResponse> {
        const response = await this.esClient.deleteByQuery(request.getParam());
        console.log('RESPONSE:', JSON.stringify(response, null, 2));
        return new BtEsDeleteByQueryResponse(response);
    }
}

