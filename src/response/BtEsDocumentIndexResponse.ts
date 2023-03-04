import {BtEsIndexResponseType } from "../type/BtEsResponseType";
import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsDocumentIndexResponse extends BtEsAbstractResponse {

    /*
    "body": {
        "_index": "search-dev",
        "_type": "_doc",
        "_id": "6099",
        "_version": 3,
        "result": "updated",
        "_shards": {
          "total": 1,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 13651,
        "_primary_term": 2
    },
    */

    protected response: BtEsIndexResponseType;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        this.response = {
            id : body['_id'],
            index : body['_index'],
            version : body['_version'],
            result : body['result'],
            sequenceNumber : body['_seq_no'],
            primaryTerm : body['_primary_term'],
            shardInfo : {
                total:body['_shards']['total'],
                success:body['_shards']['successful'],
                fail:body['_shards']['failed'],
            }
        }
    }

    public getResponse(): BtEsIndexResponseType {
        return this.response;
    }
}