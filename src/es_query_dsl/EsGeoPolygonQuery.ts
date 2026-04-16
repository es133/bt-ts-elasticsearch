'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsGeoPolygonQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string, points: any[]) {
        super('geo_polygon');
        this.fieldName = field;
        this.setFieldProperty(field, 'points', points);
    }

    public points(points: any[]): EsGeoPolygonQuery {
        this.setFieldProperty(this.fieldName, 'points', points);
        return this;
    }

    public validationMethod(method: string): EsGeoPolygonQuery {
        this.setProperty('validation_method', method);
        return this;
    }

    public ignoreUnmapped(value: boolean): EsGeoPolygonQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

    public boost(value: number): EsGeoPolygonQuery {
        this.setProperty('boost', value);
        return this;
    }
}
