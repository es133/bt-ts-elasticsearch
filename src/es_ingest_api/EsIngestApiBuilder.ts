import {EsSimulatePipelineApi} from "./EsSimulatePipelineApi";

export class EsIngestApiBuilder {

    static simulatePipelineApi(): EsSimulatePipelineApi {
        return new EsSimulatePipelineApi();
    }

}
