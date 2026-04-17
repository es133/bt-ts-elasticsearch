'use strict';

import {ES_QUERY_PARAM, ES_VERSION_TYPE} from "../type/BtEsEnums";

export class BtEsAbstractRequest {
    param: any;
    constructor() {
        this.param = {};
    }

    public setIndex(indexName:string | null):void {
        this.param[ES_QUERY_PARAM.INDEX] = indexName;
    }

    /**
     * @deprecated Elasticsearch 9.x removed support for mapping types. This method is kept for backward compatibility but does nothing.
     */
    public setType(typeName:string):void {
        // No-op: Elasticsearch 9.x removed mapping types
    }

    public setSource(option:boolean | Array<string>):void {
        this.param[ES_QUERY_PARAM.SOURCE] = option;
    }

    public setVersion(value:boolean):void {
        this.param[ES_QUERY_PARAM.VERSION] = value;
    }

    public setVersionType(versionType:ES_VERSION_TYPE):void {
        this.param[ES_QUERY_PARAM.VERSION_TYPE] = versionType;
    }

    public setStoredField(fields:Array<string>):void {
        this.param[ES_QUERY_PARAM.STORED_FIELDS] = fields;
    }

    public set index(indexName:string){
        this.setIndex(indexName);
    }

    /**
     * @deprecated Elasticsearch 9.x removed support for mapping types. This setter is kept for backward compatibility but does nothing.
     */
    public set type(typeName:string){
        this.setType(typeName);
    }

    public set source(option:boolean | Array<string>) {
        this.setSource(option);
    }

    public set version(value:boolean) {
        this.setVersion(value);
    }

    public set storedField(fields:Array<string>) {
        this.setStoredField(fields);
    }

    public setSourceFiltering(includes?:Array<string>, excludes?:Array<string>):void {
        if (includes) {
            this.param[ES_QUERY_PARAM.SOURCE_INCLUDES] = includes;
        }
        if (excludes) {
            this.param[ES_QUERY_PARAM.SOURCE_EXCLUDES] = excludes;
        }
    }

    public toJSON(pretty?:boolean):string {
        if (pretty) {
            return JSON.stringify(this.param, null, 2);
        } else {
            return JSON.stringify(this.param);
        }
    }

    public getParam():any {
        return this.param;
    }

}
