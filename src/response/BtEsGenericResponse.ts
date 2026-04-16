import {BtEsResponse} from "../interface/BtEsResponse";

export class BtEsGenericResponse implements BtEsResponse {

    public statusCode?:number;
    public acknowledged?:boolean;
    public shardsAcknowledged?:boolean;
    public targetIndex?:string;
    public succeeded?:boolean;
    public errors?: boolean;
    public items?: any;
    public took?: number;

    constructor(response: any) {
        this.statusCode = response?.['status'];
        this.acknowledged = response?.['acknowledged'];
        this.shardsAcknowledged = response?.['shards_acknowledged'];
        this.targetIndex = response?.['index'];
        this.succeeded = response?.['succeeded'];
        this.errors = response?.['errors'];
        this.items = response?.['items'];
        this.took = response?.['took'];
    }

    public toString(): string{
        let response = {};
        if (this.statusCode) {
            Object.assign(response, {statusCode: this.statusCode});
        }
        if (this.acknowledged) {
            Object.assign(response, {acknowledged: this.acknowledged});
        }
        if (this.shardsAcknowledged) {
            Object.assign(response, {shardAcknowledged: this.shardsAcknowledged});
        }
        if (this.targetIndex) {
            Object.assign(response, {targetIndex: this.targetIndex});
        }
        if (this.succeeded) {
            Object.assign(response, {succeed: this.succeeded});
        }
        if (this.errors) {
            Object.assign(response, {errors: this.errors});
        }
        if (this.items) {
            Object.assign(response, {items: this.items});
        }
        if (this.took) {
            Object.assign(response, {took: this.took});
        }

        return JSON.stringify(response)
    }
}