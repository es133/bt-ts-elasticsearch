'use strict';
import { EsAbstractSuggest } from './EsAbstractSuggest';
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsTermSuggest extends EsAbstractSuggest {
    constructor(name:string, field:string) {
        super(name, 'term');
        if (field) {
            this.setTypeProperty('field', field);
        }
    }

    public field(field:string): EsTermSuggest {
        this.setTypeProperty('field', field);
        return this;
    }

    //The suggest text. The suggest text is a required option that needs to be set globally or per suggestion.
    public text(text:string): EsTermSuggest {
        this.setTypeProperty('text', text);
        return this;
    }

    //The analyzer to analyse the suggest text with. Defaults to the search analyzer of the suggest field.
    public analyzer(analyzer:any): EsTermSuggest {
        this.setTypeProperty('analyzer', analyzer);
        return this;
    }

    //The maximum corrections to be returned per suggest text token.
    public size(value:number): EsTermSuggest {
        this.setTypeProperty('size', value);
        return this;
    }

    /*
    Defines how suggestions should be sorted per suggest text term. Two possible values:
    - score: Sort by score first, then document frequency and then the term itself.
    - frequency: Sort by document frequency first, then similarity score and then the term itself.
     */
    public sort(type:string): EsTermSuggest {
        this.setTypeProperty('sort', type);
        return this;
    }

    /*
    The suggest mode controls what suggestions are included or controls for what suggest text terms, suggestions should be suggested. Three possible values can be specified:
    - missing: Only provide suggestions for suggest text terms that are not in the index. This is the default.
    - popular: Only suggest suggestions that occur in more docs than the original suggest text term.
    - always: Suggest any matching suggestions based on terms in the suggest text.
    */
    public modeMissing(): EsTermSuggest {
        this.setTypeProperty('suggest_mode', 'missing');
        return this;
    }
    public modePopular(): EsTermSuggest {
        this.setTypeProperty('suggest_mode', 'popular');
        return this;
    }
    public modeAlways(): EsTermSuggest {
        this.setTypeProperty('suggest_mode', 'always');
        return this;
    }

    /*
    addOption For
        max_edits
        prefix_length
        min_word_length
        shard_size
        max_inspections
        min_doc_freq
        max_term_freq
        string_distance
            - internal: The default based on damerau_levenshtein but highly optimized for comparing string distance for terms inside the index.
            - damerau_levenshtein: String distance algorithm based on Damerau-Levenshtein algorithm.
            - levenshtein: String distance algorithm based on Levenshtein edit distance algorithm.
            - jaro_winkler: String distance algorithm based on Jaro-Winkler algorithm.
            - ngram: String distance algorithm based on character n-grams.
    */
}
