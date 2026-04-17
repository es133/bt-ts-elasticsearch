'use strict';

import { BtEsAbstractDao } from './BtEsAbstractDao';
import { BtEsAbstractSearchRequest } from './bt_es_request/BtEsAbstractSearchRequest';
import { BtEsSearchResponse } from "./response/BtEsSearchResponse";
import { BtEsGenericResponse } from "./response/BtEsGenericResponse";

export class BtEsSearchDao extends BtEsAbstractDao {

    public async requestSearch<T = unknown>(request: BtEsAbstractSearchRequest): Promise<BtEsSearchResponse<T>> {
        const response = await this.esClient.search(request.getParam());
        return new BtEsSearchResponse(response);
    }

    public async requestScroll<T = unknown>(scrollId: string, scrollTimeout: string): Promise<BtEsSearchResponse<T>> {
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

    public async deleteScroll(scrollId: string | Array<string>): Promise<BtEsGenericResponse> {
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
}
