'use strict';
import { EsQueryDsl} from '../interface/EsQueryDsl';
import {EsAbstractQueryDsl} from "../es_query_dsl/EsAbstractQueryDsl";

export class EsHighlight extends EsAbstractQueryDsl {
    constructor(fields:string|Array<string>) {
        super('highlight');
        //this._fields = fields;

        if (Array.isArray(fields)) {
            for (let i = 0 ; i < fields.length; i++) {
                this.setFieldProperty('fields', fields[i], {});
            }
        } else{
            this.setFieldProperty('fields', fields, {});
        }
    }

    public addField(fields:string|Array<string>): EsHighlight {
        if (Array.isArray(fields)) {
            for (let i = 0 ; i < fields.length; i++) {
                this.setFieldProperty('fields', fields[i], {});
            }
        } else{
            this.setFieldProperty('fields', fields, {});
        }
        return this;
    }

    public type(value:string, field?:string): EsHighlight {
        return this.setHighlightOption('type', value, field);
    }

    public boundaryChars(value:string, field?:string): EsHighlight {
        return this.setHighlightOption('boundary_chars', value, field);
    }

    public boundaryMaxScan(value:number, field?:string): EsHighlight {
        return this.setHighlightOption('boundary_max_scan', value, field);
    }

    public boundaryScanner(scannerType:string, field?:string ): EsHighlight {
        return this.setHighlightOption('boundary_scanner', scannerType, field)
    }

    public boundaryScannerLocale(locale:string, field?:string ): EsHighlight {
        return this.setHighlightOption('boundary_scanner_locale', locale, field)
    }

    public encoder(encoder:string, field?:string): EsHighlight {
        return this.setHighlightOption('encoder', encoder, field)
    }

    public highlightQuery(query:EsHighlight, field?:string): EsHighlight {
        return this.setHighlightOption('highlight_query', query, field)
    }

    public preTags(tag:string, field?:string): EsHighlight {
        return this.setHighlightOption('pre_tags', tag, field)
    }

    public postTags(tag:string, field?: string): EsHighlight {
        return this.setHighlightOption('post_tags', tag, field)
    }

    public tagsSchema(schema:string, field?: string): EsHighlight {
        return this.setHighlightOption('tags_schema', schema, field)
    }

    public requireFieldMatch(value:boolean, field?: string): EsHighlight {
        return this.setHighlightOption('require_field_match', value, field)
    }

    public fvhPhraseLimit(value:number, field?: string): EsHighlight {
        return this.setHighlightOption('phrase_limit', value, field)
    }

    public fvhMatchedFields(fields:Array<string>, field?: string): EsHighlight {
        return this.setHighlightOption('matched_fields', fields, field)
    }

    public numOfReturnedTextWhenNotMatched(value:number, field?: string): EsHighlight {
        return this.setHighlightOption('no_match_size', value, field)
    }

    public fragmenter(type:string, field?: string): EsHighlight {
        return this.setHighlightOption('fragmenter', type, field)
    }

    public numOfFragments(value:number, field?: string): EsHighlight {
        return this.setHighlightOption('number_of_fragments', value, field)
    }

    public fvhFragmentOffset(offset:number, field?: string): EsHighlight {
        return this.setHighlightOption('fragment_offset', offset, field)
    }

    public fvhFragmentSize(size:number, field?: string): EsHighlight {
        return this.setHighlightOption('fragment_size', size, field)
    }

    public order(order:any, field?: string): EsHighlight {
        return this.setHighlightOption('order', order, field)
    }

    protected setHighlightOption(optionName:string, value:any, field?:string) {

        if (!field) {
            this.setProperty(optionName, value);
        } else {
            let option = { [optionName]: value };
            this.setFieldProperty('fields', field, option);
        }
        return this;
    }

}
