'use strict';

import {EsAbstractSuggest} from "./EsAbstractSuggest";
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsCompletionSuggest extends EsAbstractSuggest {
    constructor(name:string, field?:string) {
        super(name, 'completion');
        if (field) {
            this.setTypeProperty('field', field);
        }
    }

    public field(field:string): EsCompletionSuggest {
        this.setTypeProperty('field', field);
        return this;
    }

    public size(value:number): EsCompletionSuggest {
        this.setTypeProperty('size', value);
        return this;
    }

    public skipDuplicates(value:boolean): EsCompletionSuggest {
        this.setTypeProperty('skip_duplicates', value);
        return this;
    }

    public prefix(text:string): EsCompletionSuggest {
        this.setProperty('prefix', text);
        return this;
    }

    public regex(regex:string, flags?:string, maxStates?:number): EsCompletionSuggest {

        this.setProperty('regex', regex);

        if (flags) {
            this.setProperty('flags', flags);
        }

        if (maxStates) {
            this.setProperty('max_determinized_states', maxStates);
        }
        return this;
    }

    public fuzzy(fuzziness?:number|string, transpositions?:boolean, minLength?:number, prefixLength?:number, unicodeAware?:boolean): EsCompletionSuggest {
        this.setTypeProperty('fuzzy', {});

        if (fuzziness){
            this.setTypeProperty('fuzzy', {fuzziness:fuzziness});
        }
        if (transpositions){
            this.setTypeProperty('fuzzy', {transpositions:transpositions});
        }
        if (minLength){
            this.setTypeProperty('fuzzy', {min_length:minLength});
        }
        if (prefixLength){
            this.setTypeProperty('fuzzy', {prefix_length:prefixLength});
        }
        if (unicodeAware){
            this.setTypeProperty('fuzzy', {unicode_aware:unicodeAware});
        }

        return this;

    }

}
