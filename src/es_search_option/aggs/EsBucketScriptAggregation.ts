'use strict';
import {EsBucketAbstractAggregation} from "./EsBucketAbstractAggregation";

export class EsBucketScriptAggregation extends EsBucketAbstractAggregation {
    constructor (name:string, path?:string) {
        super(name, 'bucket_script', path);
    }

    public format(decimalFormat:string):EsBucketScriptAggregation  {
        this.setAggsProperty('format', decimalFormat);
        return this;
    }

    public script(script:any): EsBucketScriptAggregation  {
        this.setAggsProperty('script', script);
        return this;
    }
}
