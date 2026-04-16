import {EsRetriever} from '../interface/EsRetriever';

export class EsAbstractRetriever implements EsRetriever {
    protected retrieverName: string;
    protected retrieverBody: any;

    constructor(name: string) {
        this.retrieverName = name;
        this.retrieverBody = {};
        this.retrieverBody[this.retrieverName] = {};
    }

    name(): string {
        return this.retrieverName;
    }

    body(): any {
        return this.retrieverBody;
    }

    protected setProperty(propertyName: string, value: any): void {
        this.retrieverBody[this.retrieverName][propertyName] = value;
    }

    protected hasProperty(propertyName: string): boolean {
        if (this.retrieverBody[this.retrieverName][propertyName]) {
            return true;
        } else {
            return false;
        }
    }

    public isEsRetriever(): boolean {
        return true;
    }
}
