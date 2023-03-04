'use strict';
import { EsQueryDsl } from '../../interface/EsQueryDsl';

export class EsAbstractAggregation implements EsQueryDsl {
    protected aggsName: string;
    protected aggsType: string;
    protected aggsBody: any;

    constructor(name:string, type:string) {
        this.aggsName = name;
        this.aggsType = type;
        this.aggsBody = {};
        this.aggsBody[this.aggsName] = {};
        this.aggsBody[this.aggsName][this.aggsType] = {};
    }

    protected setAggsProperty(propertyName:string, value: any): void {
        this.aggsBody[this.aggsName][this.aggsType][propertyName] = value;
    }

    protected addAggsProperty(propertyName: string, value: any): void {
        if(Array.isArray(this.aggsBody[this.aggsName][this.aggsType][propertyName])) {
            this.aggsBody[this.aggsName][this.aggsType][propertyName].push(value);
        } else {
            if (Array.isArray(value)) {
                this.aggsBody[this.aggsName][this.aggsType][propertyName] = value;
            } else {
                this.aggsBody[this.aggsName][this.aggsType][propertyName] = [value];

            }
        }
    }

    protected hasAggsProperty(propertyName:string):boolean {
        if (this.aggsBody[this.aggsName][this.aggsType][propertyName]) {
            return true;
        } else {
            return false;
        }
    }

    public isEsQueryDsl(): boolean {
        return true;
    }

    public name(): string {
        return this.aggsName;
    }

    public body(): any {
        return this.aggsBody;
    }

    public subAggregations(aggs:EsQueryDsl): any {
        if (!this.aggsBody[this.aggsName]['aggregations']) {
            this.aggsBody[this.aggsName]['aggregations'] = [];
        }
        this.aggsBody[this.aggsName]['aggregations'].push(aggs);
        return this;
    }

}
