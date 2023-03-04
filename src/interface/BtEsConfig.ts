import {ClientOptions} from "@elastic/elasticsearch";

export interface BtEsConfig {

    /*
    clusterConfiguration: {
        nodes:Array<string>;
        auth:{
            username:string;
            password:string;
            apiKey: string;
            bearer: string;
        }
        maxRetries: number;
        requestTimeout: number;
        pingTimeout: number;
        compression:'gzip'|false;
        name: string;
    },
    index:Map<string, string>;
     */

    buildConnectionConfig(): ClientOptions;

}
