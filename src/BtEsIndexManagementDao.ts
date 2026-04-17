'use strict';

import { BtEsAbstractDao } from './BtEsAbstractDao';
import { BtEsGenericResponse } from "./response/BtEsGenericResponse";
import { EsAnalyzeApi } from "./es_indices_api/EsAnalyzeApi";
import { EsSimulatePipelineApi } from "./es_ingest_api/EsSimulatePipelineApi";
import { BtIndicesAnalyzeToken } from './type/BtEsResponseType';

export class BtEsIndexManagementDao extends BtEsAbstractDao {

    public async createIndex(indexName: string, mapping: any, setting: any): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.create({
            index: indexName,
            mappings: mapping,
            settings: setting
        });
        return new BtEsGenericResponse(response);
    }

    public async clientBulkApi(operations: any): Promise<BtEsGenericResponse> {
        return await this.esClient.bulk({ refresh: true, operations: operations });
    }

    public async indexExists(indexName: string): Promise<boolean> {
        return await this.esClient.indices.exists({ index: indexName });
    }

    public async deleteIndex(indexName: string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.delete({ index: indexName });
        return new BtEsGenericResponse(response);
    }

    public async getIndexListWithAliasName(aliasName: string): Promise<Array<string>> {
        const response = await this.esClient.indices.getAlias({ name: aliasName });
        return Object.keys(response);
    }

    public async existsAlias(aliasName: string): Promise<boolean> {
        return await this.esClient.indices.existsAlias({ name: aliasName });
    }

    public async putAlias(indexName: string, aliasName: string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.putAlias({ index: indexName, name: aliasName });
        return new BtEsGenericResponse(response);
    }

    public async exchangeAlias(putIndexList: Array<string>, removeIndexList: Array<string>, aliasName: string): Promise<BtEsGenericResponse> {
        const query: any = { actions: [] };
        for (let putIndexName of putIndexList) {
            query['actions'].push({ add: { index: putIndexName, alias: aliasName } });
        }

        for (let removeIndexName of removeIndexList) {
            query['actions'].push({ remove: { index: removeIndexName, alias: aliasName } });
        }

        let response = await this.esClient.indices.updateAliases(query);
        return new BtEsGenericResponse(response);
    }

    public async deleteAlias(indexName: string, aliasName: string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.deleteAlias({ index: indexName, name: aliasName });
        return new BtEsGenericResponse(response);
    }

    public async createIndexTemplate(templateName: string, template: any): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.putIndexTemplate({
            name: templateName,
            body: template
        });
        return new BtEsGenericResponse(response);
    }

    public async deleteIndexTemplate(templateName: string): Promise<BtEsGenericResponse> {
        const response = await this.esClient.indices.deleteIndexTemplate({ name: templateName });
        return new BtEsGenericResponse(response);
    }

    public async requestAnalyze(analyzeRequest: EsAnalyzeApi): Promise<BtIndicesAnalyzeToken[] | undefined> {
        const response = await this.esClient.indices.analyze(analyzeRequest.buildRequest());
        return response.tokens;
    }

    public async ingestSimulate(simulateRequest: EsSimulatePipelineApi): Promise<any> {
        const response = await this.esClient.ingest.simulate(simulateRequest.buildRequest());
        return response;
    }
}
