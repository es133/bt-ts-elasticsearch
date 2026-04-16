'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsGeoBoundingBoxQuery extends EsAbstractQueryDsl {
    protected fieldName: string;

    constructor(field: string) {
        super('geo_bounding_box');
        this.fieldName = field;
    }

    public boundingBox(topLeft: any, bottomRight: any): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'top_left', topLeft);
        this.setFieldProperty(this.fieldName, 'bottom_right', bottomRight);
        return this;
    }

    public topLeft(value: any): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'top_left', value);
        return this;
    }

    public bottomRight(value: any): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'bottom_right', value);
        return this;
    }

    public top(value: number): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'top', value);
        return this;
    }

    public left(value: number): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'left', value);
        return this;
    }

    public bottom(value: number): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'bottom', value);
        return this;
    }

    public right(value: number): EsGeoBoundingBoxQuery {
        this.setFieldProperty(this.fieldName, 'right', value);
        return this;
    }

    public validationMethod(method: string): EsGeoBoundingBoxQuery {
        this.setProperty('validation_method', method);
        return this;
    }

    public type(type: string): EsGeoBoundingBoxQuery {
        this.setProperty('type', type);
        return this;
    }

    public ignoreUnmapped(value: boolean): EsGeoBoundingBoxQuery {
        this.setProperty('ignore_unmapped', value);
        return this;
    }
}
