'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsGeoDistanceQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string, location: any, distance: string) {
        super('geo_distance');
        this.fieldName = field;
        this.setProperty('distance', distance);
        this.setProperty(field, location);
    }

    public distance(distance: string): EsGeoDistanceQuery {
        this.setProperty('distance', distance);
        return this;
    }

    public location(location: any): EsGeoDistanceQuery {
        this.setProperty(this.fieldName, location);
        return this;
    }

    public distanceType(type: string): EsGeoDistanceQuery {
        this.setProperty('distance_type', type);
        return this;
    }

    public validationMethod(method: string): EsGeoDistanceQuery {
        this.setProperty('validation_method', method);
        return this;
    }

    public ignoreUnmapped(value: boolean): EsGeoDistanceQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }

    public boost(value: number): EsGeoDistanceQuery {
        this.setProperty('boost', value);
        return this;
    }
}
