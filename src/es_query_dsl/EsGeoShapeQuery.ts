'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsGeoShapeQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string) {
        super('geo_shape');
        this.fieldName = field;
    }

    public shape(shape: any): EsGeoShapeQuery {
        this.setFieldProperty(this.fieldName, 'shape', shape);
        return this;
    }

    public indexedShape(indexedShape: any): EsGeoShapeQuery {
        this.setFieldProperty(this.fieldName, 'indexed_shape', indexedShape);
        return this;
    }

    public relation(relation: string): EsGeoShapeQuery {
        this.setFieldProperty(this.fieldName, 'relation', relation);
        return this;
    }

    public ignoreUnmapped(value: boolean): EsGeoShapeQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

    public boost(value: number): EsGeoShapeQuery {
        this.setProperty('boost', value);
        return this;
    }
}
