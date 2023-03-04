'use strict';
import { EsQueryDsl } from '../../interface/EsQueryDsl';

export class EsAbstractSuggest implements EsQueryDsl {
    protected suggestName: string;
    protected suggestBody: any;
    protected suggestType: string;

    constructor(name:string, type:string) {
        this.suggestName = name;
        this.suggestType = type;
        this.suggestBody = {};
        this.suggestBody[this.suggestName] = {};
        this.suggestBody[this.suggestName][this.suggestType] = {};
    }


    protected setTypeProperty(propertyName:string, value: any):void {
        this.suggestBody[this.suggestName][this.suggestType][propertyName] = value;
    }

    protected addTypeProperty(propertyName: string, value: any):void {
        if(Array.isArray(this.suggestBody[this.suggestName][this.suggestType][propertyName])) {
            this.suggestBody[this.suggestName][this.suggestType][propertyName].push(value);
        } else {
            if (Array.isArray(value)) {
                this.suggestBody[this.suggestName][this.suggestType][propertyName] = value;
            } else {
                this.suggestBody[this.suggestName][this.suggestType][propertyName] = [value];

            }
        }
    }

    protected setProperty(propertyName:string, value: any):void {
        this.suggestBody[this.suggestName][propertyName] = value;
    }

    protected addProperty(propertyName: string, value: any):void {
        if(Array.isArray(this.suggestBody[this.suggestName][propertyName])) {
            this.suggestBody[this.suggestName][propertyName].push(value);
        } else {
            if (Array.isArray(value)) {
                this.suggestBody[this.suggestName][propertyName] = value;
            } else {
                this.suggestBody[this.suggestName][propertyName] = [value];

            }
        }
    }

    protected hasProperty(propertyName:string):boolean {
        if (this.suggestBody[this.suggestName][propertyName]) {
            return true;
        } else {
            return false;
        }
    }

    public addOption(name:string, value:any): EsQueryDsl {
        this.suggestBody[this.suggestName][this.suggestType][name] = value;
        return this;
    }

    public isEsQueryDsl(): boolean {
        return true;
    }

    public name(): string {
        return this.suggestName;
    }

    public body(): any {
        return this.suggestBody;
    }

    public type(): string{
        return this.suggestType;
    }
}
