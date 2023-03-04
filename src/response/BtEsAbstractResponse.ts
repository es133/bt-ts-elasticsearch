import {BtEsResponse} from '../interface/BtEsResponse';

export class BtEsAbstractResponse implements BtEsResponse {

    protected statusCode:number;

    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }

    public status(): number {
        return 0;
    }

}
