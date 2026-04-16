import {BtEsGetResponseType} from "../type/BtEsResponseType";
import {BtEsResponse} from '../interface/BtEsResponse';

export class BtEsGetResponse implements BtEsResponse {

    protected response:BtEsGetResponseType;

    constructor(response:any) {
        
        this.response = {
            index:response['_index'],
            id:response['_id'],
            version:response['_version'],
            sequenceNumber:response['_seq_no'],
            primaryTerm:response['_primary_term'],
            found:response['found'],
            source:response['_source'],
        }
    }

    public getDocument():any {
        return this.response.source;
    }
}