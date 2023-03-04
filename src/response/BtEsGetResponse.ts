import {BtEsGetResponseType} from "../type/BtEsResponseType";
import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsGetResponse extends BtEsAbstractResponse {

    protected response:BtEsGetResponseType;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        this.response = {
            index:body['_index'],
            id:body['_id'],
            version:body['_version'],
            sequenceNumber:body['_seq_no'],
            primaryTerm:body['_primary_term'],
            found:body['found'],
            source:body['_source'],
        }
    }

    public getDocument():any {
        return this.response.source;
    }
}