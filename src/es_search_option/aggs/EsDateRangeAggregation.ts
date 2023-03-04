'use strict';
import { EsAbstractAggregation} from './EsAbstractAggregation';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsDateRangeAggregation extends EsAbstractAggregation {
    constructor(name:string, field?:string) {
        super(name, 'date_range');
        if (field) {
            this.setAggsProperty('field', field);
        }
    }

    public field(field:string): EsDateRangeAggregation {
        this.setAggsProperty('field', field);
        return this;
    }

    public format(format:string): EsDateRangeAggregation {
        this.setAggsProperty('format', format);
        return this;
    }

    public addTo(datetime:string): EsDateRangeAggregation {
        this.addAggsProperty('ranges', {to :datetime});
        return this;
    }

    public addFrom(datetime:string): EsDateRangeAggregation {
        this.addAggsProperty('ranges', {from: datetime});
        return this;
    }

    public timezone(timezone:string): EsDateRangeAggregation {
        this.setAggsProperty('time_zone', timezone);
        return this;
    }

}
