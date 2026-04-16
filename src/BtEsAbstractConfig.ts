import {BtEsConfig} from "./interface/BtEsConfig";
import {ClientOptions, ApiKeyAuth} from '@elastic/elasticsearch';

export class BtEsAbstractConfig implements BtEsConfig {

    nodes?:Array<string>
    auth?: {username: string, password: string} | ApiKeyAuth;
    maxRetries?:number;
    requestTimeout?: number;
    pingTimeout?: number;
    name?: string;
    indexNameMap:Map<string, string>;
    indexSettingMap?:Map<string, JSON>;
    indexMappingMap?:Map<string, JSON>;
    indexTemplateMap?:Map<string, JSON>;
    ilmPolicyMap?:Map<string, JSON>;

    constructor(configObj:any) {
        this.nodes = [];
        if (configObj?.hasOwnProperty('configuration')) {
            const configuration = configObj['configuration'];
            if (configuration?.hasOwnProperty('nodes')) {
                this.nodes.push(...configuration['nodes']);
            }
            if (configuration?.hasOwnProperty('maxRetries')) {
                this.maxRetries = configuration['maxRetries'];
            }
            if (configuration?.hasOwnProperty('requestTimeout')) {
                this.requestTimeout = configuration['requestTimeout'];
            }
            if (configuration?.hasOwnProperty('pingTimeout')) {
                this.pingTimeout = configuration['pingTimeout'];
            }
            if (configuration?.hasOwnProperty('authApiKey')) {
                this.auth = configuration['authApiKey'];
            }
            if (configuration?.hasOwnProperty('authBearer')) {
                this.auth = configuration['authBearer'];
            }
            if (configuration?.hasOwnProperty('authBasic')) {
                this.auth = configuration['authBasic'];
            }
        }

        this.indexNameMap = new Map<string, string>();
        if (configObj?.hasOwnProperty('index')) {
            for (const [key, value] of Object.entries(configObj['index'])) {
                this.indexNameMap.set(key, <string>value);
            }
        }

        if (configObj?.hasOwnProperty('setting')) {
            this.indexSettingMap = new Map<string, JSON>();
            for (const [key, value] of Object.entries(configObj['setting'])) {
                this.indexSettingMap.set(key, <JSON>value);
            }
        }

        if (configObj?.hasOwnProperty('mapping')) {
            this.indexMappingMap = new Map<string, JSON>();
            for (const [key, value] of Object.entries(configObj['mapping'])) {
                this.indexMappingMap.set(key, <JSON>value);
            }
        }

        if (configObj?.hasOwnProperty('template')) {
            this.indexTemplateMap = new Map<string, JSON>();
            for (const [key, value] of Object.entries(configObj['template'])) {
                this.indexTemplateMap.set(key, <JSON>value);
            }
        }

        if (configObj?.hasOwnProperty('ilm_policy')) {
            this.ilmPolicyMap = new Map<string, JSON>();
            for (const [key, value] of Object.entries(configObj['ilm_policy'])) {
                this.ilmPolicyMap.set(key, <JSON>value);
            }
        }
    }

    public buildConnectionConfig(): ClientOptions {
        return {
            nodes: this.nodes,
            maxRetries: this.maxRetries,
            requestTimeout: this.requestTimeout ?? 30000,
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

    public getIndexSetting(key: string): JSON | null {
        if (this.indexSettingMap?.has(key)) {
            return <JSON>this.indexSettingMap.get(key);
        } else {
            return null
        }
    }

    public getIndexMapping(key: string): JSON | null {
        if (this.indexMappingMap?.has(key)) {
            return <JSON>this.indexMappingMap.get(key);
        } else {
            return null
        }
    }

    public getIndexTemplate(key: string): JSON | null {
        if (this.indexTemplateMap?.has(key)) {
            return <JSON>this.indexTemplateMap.get(key);
        } else {
            return null
        }
    }

    public getIlmPolicy(key: string): JSON | null {
        if (this.ilmPolicyMap?.has(key)) {
            return <JSON>this.ilmPolicyMap.get(key);
        } else {
            return null
        }
    }
}