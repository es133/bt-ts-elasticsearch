import {BtEsConfig} from "./interface/BtEsConfig";
import {ClientOptions} from "@elastic/elasticsearch";
import {ApiKeyAuth, BasicAuth, BearerAuth} from "@elastic/elasticsearch/lib/pool";

export class BtEsAbstractConfig implements BtEsConfig {

    public nodes?:Array<string>
    public auth?: BasicAuth | ApiKeyAuth | BearerAuth;
    public maxRetries?:number;
    public requestTimeout?: number;
    public pingTimeout?: number;
    public name?: string;
    public indexNameMap:Map<string, string>

    constructor(configObj:any) {
        this.nodes = [];
        if (configObj.hasOwnProperty('configuration')) {
            const configuration = configObj['configuration'];
            if (configuration.hasOwnProperty('nodes')) {
                this.nodes.push(...configuration['nodes']);
            }
            if (configuration.hasOwnProperty('name')) {
                this.name = configuration['name'];
            }
            if (configuration.hasOwnProperty('maxRetries')) {
                this.maxRetries = configuration['maxRetries'];
            }
            if (configuration.hasOwnProperty('requestTimeout')) {
                this.requestTimeout = configuration['requestTimeout'];
            }
            if (configuration.hasOwnProperty('pingTimeout')) {
                this.pingTimeout = configuration['pingTimeout'];
            }
            if (configuration.hasOwnProperty('authApiKey')) {
                this.auth = configuration['authApiKey'];
            }
            if (configuration.hasOwnProperty('authBearer')) {
                this.auth = configuration['authBearer'];
            }
            if (configuration.hasOwnProperty('authBasic')) {
                this.auth = configuration['authBasic'];
            }
        }

        this.indexNameMap = new Map<string, string>();
        if (configObj.hasOwnProperty('index')) {
            for (const [key, value] of Object.entries(configObj['index'])) {
                this.indexNameMap.set(key, <string>value);
            }
        }
    }

    public buildConnectionConfig(): ClientOptions {
        return {
            nodes: this.nodes,
            maxRetries: this.maxRetries,
            requestTimeout: this.requestTimeout,
            pingTimeout: this.pingTimeout,
            name: this.name,
            auth: this.auth
        };
    }

    public getIndexName(key: string):string | null {
        if (this.indexNameMap.has(key)) {
            return <string>this.indexNameMap.get(key);
        } else {
            return null
        }
    }

}