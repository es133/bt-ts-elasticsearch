'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsPercolateQuery extends EsAbstractQueryDsl {

    constructor(field: string, document: any) {
        super('percolate');
        this.setProperty('field', field);
        this.setProperty('document', document);
    }

    public field(field: string): EsPercolateQuery {
        this.setProperty('field', field);
        return this;
    }

    public document(document: any): EsPercolateQuery {
        this.setProperty('document', document);
        return this;
    }

    public documents(documents: any[]): EsPercolateQuery {
        this.setProperty('documents', documents);
        return this;
    }

    public index(index: string): EsPercolateQuery {
        this.setProperty('index', index);
        return this;
    }

    public id(id: string): EsPercolateQuery {
        this.setProperty('id', id);
        return this;
    }

    public routing(routing: string): EsPercolateQuery {
        this.setProperty('routing', routing);
        return this;
    }

    public preference(preference: string): EsPercolateQuery {
        this.setProperty('preference', preference);
        return this;
    }

    public version(version: number): EsPercolateQuery {
        this.setProperty('version', version);
        return this;
    }

    public queryName(name: string): EsPercolateQuery {
        this.setProperty('name', name);
        return this;
    }
}
