import {BtEsIndexResponseType} from "../type/BtEsResponseType";
import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsBulkIndexResponse extends BtEsAbstractResponse {
    /*
    "body": {
        "took": 4,
        "errors": false,
        "items": [
          {
            "index": {
              "_index": "article-dev",
              "_type": "_doc",
              "_id": "700252",
              "_version": 2,
              "result": "updated",
              "_shards": {
                "total": 1,
                "successful": 1,
                "failed": 0
              },
              "_seq_no": 7428,
              "_primary_term": 1,
              "status": 200
            }
          },
     */

    protected elapsedTime:number;
    protected error:boolean;
    protected resultList:Array<BtEsIndexResponseType>;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        this.resultList = [];
        this.elapsedTime = body['took'];
        this.error = body['errors'];

        if (body.hasOwnProperty('items') && Array.isArray(body['items'])) {
            for (let item of body['items']) {
                //console.log('INDEX ITEM:', item);
                let itemResult = null;
                let action = null;
                if (item.hasOwnProperty('index')) {
                    itemResult = item['index'];
                    action = 'index';
                } else if (item.hasOwnProperty('create')) {
                    itemResult = item['create'];
                    action = 'create';
                } else if (item.hasOwnProperty('delete')) {
                    itemResult = item['delete'];
                    action = 'delete';
                } else if (item.hasOwnProperty('update')) {
                    itemResult = item['update'];
                    action = 'update';
                } else {
                    continue;
                }

                this.resultList.push ({
                    id : itemResult['_id'],
                    index : itemResult['_index'],
                    version : itemResult['_itemResult'],
                    result : itemResult['result'],
                    sequenceNumber : itemResult['_seq_no'],
                    primaryTerm : itemResult['_primary_term'],
                    shardInfo : {
                        total:itemResult['_shards']['total'],
                        success:itemResult['_shards']['successful'],
                        fail:itemResult['_shards']['failed'],
                    },
                    status: itemResult['status'],
                    action: action
                })
            }
        }
    }

    public getElapsedTime(): number {
        return this.elapsedTime;
    }

    public hasError(): boolean {
        return this.error;
    }

    public getResultList(): Array<BtEsIndexResponseType> {
        return this.resultList;
    }
}