import {BtEsIndexResponseType } from "../type/BtEsResponseType";
import {BtEsResponse} from '../interface/BtEsResponse';

export class BtEsDocumentIndexResponse implements BtEsResponse {

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

    constructor(response:any) {
        
        this.response = {
            id : response['_id'],
            index : response['_index'],
            version : response['_version'],
            result : response['result'],
            sequenceNumber : response['_seq_no'],
            primaryTerm : response['_primary_term'],
            shardInfo : {
                total:response['_shards']['total'],
                success:response['_shards']['successful'],
                fail:response['_shards']['failed'],
            }
        }
    }

    public getResponse(): BtEsIndexResponseType {
        return this.response;
    }
}