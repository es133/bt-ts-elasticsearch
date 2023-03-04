import {BtEsAbstractResponse} from './BtEsAbstractResponse';

export class BtEsGenericResponse extends BtEsAbstractResponse {

    protected acknowledged?:boolean;
    protected shardsAcknowledged?:boolean;
    protected targetIndex?:string;
    protected succeeded?:boolean;

    constructor(body:any, statusCode:number) {
        super(statusCode);
        if (body['acknowledged']) {
            this.acknowledged = body['acknowledged'];
        }
        if (body['shards_acknowledged']) {
            this.shardsAcknowledged = body['shards_acknowledged'];
        }
        if (body['index']) {
            this.targetIndex = body['index']
        }

        if (body['succeeded']) {
            this.succeeded= body['succeeded']
        }
    }

    public getAcknowledged(): boolean {
        if (this.acknowledged) {
            return this.acknowledged;
        } else {
            return false;
        }
    }

    public getShardsAcknowledged(): boolean {
        if (this.shardsAcknowledged) {
            return this.shardsAcknowledged;
        } else {
            return false;
        }
    }

    public getTargetIndex(): string | null {
        if (this.targetIndex) {
            return this.targetIndex;
        } else {
            return null;
        }
    }

    public getSucceeded(): boolean {
        if (this.succeeded) {
            return this.succeeded;
        } else {
            return false;
        }
    }
}