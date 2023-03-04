'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsDateHistogramAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'date_histogram');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsDateHistogramAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public format(format:string): EsDateHistogramAggregation {
        this.setAggsProperty('format', format);
        return this;
    }

    public interval(interval:string, format?:string): EsDateHistogramAggregation {
        this.setAggsProperty('interval', interval);
        if (format) {
            this.setAggsProperty('format', format);
        }
        return this;
    }

    public fixedInterval(interval:string): EsDateHistogramAggregation {
        this.setAggsProperty('fixed_interval', interval);
        return this;
    }

    public calendarInterval(interval:string): EsDateHistogramAggregation {
        this.setAggsProperty('calendar_interval', interval);
        return this;
    }

    public minDocCount(docCount:number): EsDateHistogramAggregation {
        this.setAggsProperty('min_doc_count', docCount);
        return this;
    }

    public extendedBounds(min:number | string, max:number | string): EsDateHistogramAggregation {
        this.setAggsProperty('extended_bounds', {min: min, max:max});
        return this;
    }

    public missing(value:number|string): EsDateHistogramAggregation {
        this.setAggsProperty('missing', value);
        return this;
    }

    public timezone(timezone:string): EsDateHistogramAggregation {
        this.setAggsProperty('time_zone', timezone);
        return this;
    }

    public offset(offset:string): EsDateHistogramAggregation {
        this.setAggsProperty('offset', offset);
        return this;
    }
}
