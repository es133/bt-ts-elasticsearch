import {EsQueryDsl} from '../interface/EsQueryDsl';

export class EsAbstractQueryDsl implements EsQueryDsl {
    protected dslName : string;
    protected dslBody: any;

    constructor(name: string) {
        this.dslName = name;
        this.dslBody = {};
        this.dslBody[this.dslName] = {};
    }

    public name(): string {
        return this.dslName;
    }

    public body(): any {
        return this.dslBody;
    }

    protected setFieldProperty(fieldName:string, propertyName:string, value: any):void {
        if (!this.hasProperty(fieldName)) {
            this.dslBody[this.dslName][fieldName] = {};
        }
        this.dslBody[this.dslName][fieldName][propertyName] = value;
    }

    protected hasFieldProperty(fieldName:string, propertyName:string):boolean {
        if (this.dslBody[this.dslName][fieldName] &&
            this.dslBody[this.dslName][fieldName][propertyName]) {
            return true;
        } else {
            return false;
        }
    }

    protected setProperty(propertyName:string, value: any):void {
        this.dslBody[this.dslName][propertyName] = value;
    }

    protected addProperty(propertyName: string, value: any):void {
        if(Array.isArray(this.dslBody[this.dslName][propertyName])) {
            this.dslBody[this.dslName][propertyName].push(value);
        } else {
            if (Array.isArray(value)) {
                this.dslBody[this.dslName][propertyName] = value;
            } else {
                this.dslBody[this.dslName][propertyName] = [value];

            }
        }
    }

    protected hasProperty(propertyName:string):boolean {
        if (this.dslBody[this.dslName][propertyName]) {
            return true;
        } else {
            return false;
        }
    }

    public isEsQueryDsl(): boolean {
        return true;
    }
}

