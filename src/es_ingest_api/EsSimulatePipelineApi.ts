
export class EsSimulatePipelineApi {

    protected pipeline: any;
    protected docs: any;
    constructor() {
        this.pipeline = {
            processors:[]
        };
        this.docs = [];
    }

    public addDocument(document:{_source:any,_id?:number|string,_index?:string,_routing?:string}):EsSimulatePipelineApi {
        this.docs.push(document);
        return this;
    }

    public description(desc:string):EsSimulatePipelineApi  {
        this.pipeline['description'] = desc;
        return this;
    }

    public onFailure(processor:Array<any>):EsSimulatePipelineApi  {
        this.pipeline['on_failure'] = processor;
        return this;
    }

    public addProcessor(processor:any):EsSimulatePipelineApi  {
        this.pipeline['processors'].push(processor);
        return this;
    }

    public version(value:number):EsSimulatePipelineApi  {
        this.pipeline['version'] = value;
        return this;
    }

    public meta(metadata: any):EsSimulatePipelineApi  {
        this.pipeline['_meta'] = metadata;
        return this;
    }

    public buildRequest():any {
        return {
            body: {
                pipeline: this.pipeline,
                docs: this.docs
            }
        };
    }



}
