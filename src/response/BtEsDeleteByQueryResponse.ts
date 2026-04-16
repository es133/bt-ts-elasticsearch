import {BtEsUpdateByQueryResponse} from './BtEsUpdateByQueryResponse';

export class BtEsDeleteByQueryResponse extends BtEsUpdateByQueryResponse {

    constructor(response:any) {
        super(response);
    }

    public toString(): string{
        return JSON.stringify({
            response : this.response,
        })
    }
}
