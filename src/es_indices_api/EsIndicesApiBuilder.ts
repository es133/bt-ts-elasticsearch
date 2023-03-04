import {EsAnalyzeApi} from "./EsAnalyzeApi";

export class EsIndicesApiBuilder {

    static indicesAnalyzeApi(indexName?:string): EsAnalyzeApi {
        return new EsAnalyzeApi(indexName);
    }

}
