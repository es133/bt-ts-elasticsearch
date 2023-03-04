'use strict';

import {BT_ES_QUERY_PARAM, BT_ES_VERSION_TYPE} from "../type/BtEsEnums";

export class BtEsAbstractRequest {
    protected requestParam: any;
    constructor() {
        this.requestParam = {};
    }

    public setIndex(indexName:string | null):void {
        this.requestParam[BT_ES_QUERY_PARAM.INDEX] = indexName;
    }

    public getIndex(): string {
        return this.requestParam[BT_ES_QUERY_PARAM.INDEX];
    }

    public setType(typeName:string):void {
        this.requestParam[BT_ES_QUERY_PARAM.TYPE] = typeName;
    }

    public getType():string {
        return this.requestParam[BT_ES_QUERY_PARAM.TYPE];
    }

    public setSource(option:boolean | Array<string>):void {
        if (option instanceof Boolean) {
            this.requestParam[BT_ES_QUERY_PARAM.SOURCE] = true;
        } else {
            this.requestParam[BT_ES_QUERY_PARAM.SOURCE] = option;
        }
    }

    public setVersion(value:boolean):void {
        this.requestParam[BT_ES_QUERY_PARAM.VERSION] = value;
    }

    public setVersionType(versionType:BT_ES_VERSION_TYPE):void {
        this.requestParam[BT_ES_QUERY_PARAM.VERSION] = versionType;
    }

    public setStoredField(fields:Array<string>):void {
        this.requestParam[BT_ES_QUERY_PARAM.STORED_FIELDS] = fields;
    }

    public setSourceFiltering(includes?:Array<string>, excludes?:Array<string>):void {
        if (includes) {
            this.requestParam[BT_ES_QUERY_PARAM.SOURCE_INCLUDES] = includes;
        }
        if (excludes) {
            this.requestParam[BT_ES_QUERY_PARAM.SOURCE_EXCLUDES] = excludes;
        }
    }

    public toJSON(pretty?:boolean):string {
        if (pretty) {
            return JSON.stringify(this.requestParam, null, 2);
        } else {
            return JSON.stringify(this.requestParam);
        }
    }

    public getRequestParam():any {
        return this.requestParam;
    }

}
