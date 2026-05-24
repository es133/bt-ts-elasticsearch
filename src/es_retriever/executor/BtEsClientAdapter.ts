import {Client} from '@elastic/elasticsearch';
import {EsClientPort} from './EsClientPort';

export class BtEsClientAdapter implements EsClientPort {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async search(params: Record<string, any>): Promise<any> {
        return this.client.search(params as any);
    }

    public async msearch(params: Record<string, any>): Promise<any> {
        return this.client.msearch(params as any);
    }

    public async mget(params: Record<string, any>): Promise<any> {
        return this.client.mget(params as any);
    }
}
