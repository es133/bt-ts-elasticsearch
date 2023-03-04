export class EsAnalyzeApi {

    protected param: any;
    protected indexName?: string;
    constructor(indexName?:string){
        if (indexName) {
            this.indexName = indexName;
        }
        this.param= {};
    }

    public analyzer(analyzerName:string):EsAnalyzeApi {
        this.param['analyzer'] = analyzerName;
        return this;
    }

    public text(text:string|Array<string>):EsAnalyzeApi  {
        this.param['text'] = text;
        return this;
    }

    public filter(filter:Array<string|any>):EsAnalyzeApi  {
        this.param['filter'] = filter;
        return this;
    }

    public charFilter(filter:Array<string>):EsAnalyzeApi  {
        this.param['char_filter'] = filter;
        return this;
    }

    public showExplain(value:boolean):EsAnalyzeApi  {
        this.param['explain'] = value;
        return this;
    }

    public field(fieldName: string):EsAnalyzeApi  {
        this.param['field'] = fieldName;
        return this;
    }

    public tokenizer(tokenizerName: string):EsAnalyzeApi  {
        this.param['tokenizer'] = tokenizerName;
        return this;
    }

    public normalizer(normalizerName: string):EsAnalyzeApi  {
        this.param['normalizer'] = normalizerName;
        return this;
    }

    public buildRequest():any {
        /*
        analyzeQuery = {
            index:targetIndex,
            body: {
                analyzer:'company_keyword_analyzer',
                text: [text]
            }
        };
        */
        let query: any = {};
        if (this.indexName) {
            query['index'] = this.indexName;
        }

        query['body'] = this.param;
        return query;
    }



}
