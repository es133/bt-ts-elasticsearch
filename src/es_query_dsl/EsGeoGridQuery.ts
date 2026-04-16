'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsGeoGridQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string) {
        super('geo_grid');
        this.fieldName = field;
    }

    public geohash(geohash: string): EsGeoGridQuery {
        this.setFieldProperty(this.fieldName, 'geohash', geohash);
        return this;
    }

    public geotile(geotile: string): EsGeoGridQuery {
        this.setFieldProperty(this.fieldName, 'geotile', geotile);
        return this;
    }

    public geohex(geohex: string): EsGeoGridQuery {
        this.setFieldProperty(this.fieldName, 'geohex', geohex);
        return this;
    }

    public ignoreUnmapped(value: boolean): EsGeoGridQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

    public boost(value: number): EsGeoGridQuery {
        this.setProperty('boost', value);
        return this;
    }
}
