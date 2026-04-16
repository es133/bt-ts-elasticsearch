import {BtEsGetResponseType} from "../type/BtEsResponseType";
import {BtEsResponse} from '../interface/BtEsResponse';

export class BtEsMGetResponse implements BtEsResponse {

    protected resultList:Array<BtEsGetResponseType>;

    constructor(response:any) {
        
        this.resultList = [];
        if (response.hasOwnProperty('docs') && Array.isArray(response['docs'])) {
            for (let doc of response['docs']) {

                this.resultList.push(
                    {
                        index:doc['_index'],
                        id:doc['_id'],
                        version:doc['_version'],
                        sequenceNumber:doc['_seq_no'],
                        primaryTerm:doc['_primary_term'],
                        found:doc['found'],
                        source:doc['_source'],
                    }
                );
            }
        }
    }

    public getDocumentList():Array<BtEsGetResponseType> {
        return this.resultList;
    }
}