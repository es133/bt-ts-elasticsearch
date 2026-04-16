import {BtEsResponse} from "../interface/BtEsResponse";
import {BtEsUpdateByQueryResponseType} from "../type/BtEsResponseType";

export class BtEsUpdateByQueryResponse implements BtEsResponse {
    /*
    {
      "took" : 147,
      "timed_out": false,
      "total": 119,
      "deleted": 119,
      "batches": 1,
      "version_conflicts": 0,
      "noops": 0,
      "retries": {
        "bulk": 0,
        "search": 0
      },
      "throttled_millis": 0,
      "requests_per_second": -1.0,
      "throttled_until_millis": 0,
      "failures" : [ ]
    }

     */

    public response: BtEsUpdateByQueryResponseType;

    constructor(response:any) {
        this.response = {
            took: response?.['took'],
            timed_out: response?.['timed_out'],
            total: response?.['total'],
            deleted: response?.['deleted'],
            batches: response?.['batches'],
            version_conflicts: response?.['version_conflicts'],
            noops: response?.['noops'],
            retries: {
                bulk:response?.['retries']['bulk'],
                search:response?.['retries']['search'],
            },
            throttled_millis: response?.['throttled_millis'],
            requests_per_second: response?.['requests_per_second'],
            throttled_until_millis: response?.['throttled_until_millis'],
            failures: response?.['failures'],
        }
    }

    public toString(): string{
        return JSON.stringify({
            response : this.response,
        })
    }
}
