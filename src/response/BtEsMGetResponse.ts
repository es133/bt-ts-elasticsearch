import {BtEsGetResponseType} from "../type/BtEsResponseType";
import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsMGetResponse extends BtEsAbstractResponse {

    protected resultList:Array<BtEsGetResponseType>;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        this.resultList = [];
        if (body.hasOwnProperty('docs') && Array.isArray(body['docs'])) {
            for (let doc of body['docs']) {

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