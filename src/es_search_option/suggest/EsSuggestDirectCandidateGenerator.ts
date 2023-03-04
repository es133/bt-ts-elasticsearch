'use strict';

import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsSuggestDirectCandidateGenerator implements EsQueryDsl {
    protected generator:any;
    constructor() {
        this.generator = {};
    }

    public name(): string {
        return 'direct_generator';
    }
    public body() {
        return this.generator;
    }
    public isEsQueryDsl(): boolean {
        return true;
    }

    public field(field:string): EsSuggestDirectCandidateGenerator {
        this.generator['field'] = field;
        return this;
    }

    public build(): any {
        return this.generator;
    }

    //The maximum corrections to be returned per suggest text token.
    public size(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['size'] = value;
        return this;
    }

    /*
    The suggest mode controls what suggestions are included or controls for what suggest text terms, suggestions should be suggested. Three possible values can be specified:
    - missing: Only provide suggestions for suggest text terms that are not in the index. This is the default.
    - popular: Only suggest suggestions that occur in more docs than the original suggest text term.
    - always: Suggest any matching suggestions based on terms in the suggest text.
    */
    public modeMissing(): EsSuggestDirectCandidateGenerator {
        this.generator['suggest_mode'] = 'missing';
        return this;
    }

    public modePopular(): EsSuggestDirectCandidateGenerator {
        this.generator['suggest_mode'] = 'popular';
        return this;
    }
    public modeAlways(): EsSuggestDirectCandidateGenerator {
        this.generator['suggest_mode'] = 'always';
        return this;
    }
    public maxEdits(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['max_edits'] = value;
        return this;
    }

    public prefixLength(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['prefix_length'] = value;
        return this;
    }

    public minWordLength(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['min_word_length'] = value;
        return this;
    }

    public maxInspections(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['max_inspections'] = value;
        return this;
    }

    public minDocFreq(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['min_doc_freq'] = value;
        return this;
    }

    public maxTermFreq(value:number): EsSuggestDirectCandidateGenerator {
        this.generator['max_term_freq'] = value;
        return this;
    }

    public preFilter(value:any): EsSuggestDirectCandidateGenerator {
        this.generator['pre_filter'] = value;
        return this;
    }
    public postFilter(value:any): EsSuggestDirectCandidateGenerator {
        this.generator['post_filter'] = value;
        return this;
    }

}
