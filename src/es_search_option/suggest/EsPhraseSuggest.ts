'use strict';
import { EsAbstractSuggest} from './EsAbstractSuggest';
import { EsSuggestDirectCandidateGenerator} from './EsSuggestDirectCandidateGenerator'
import {EsQueryDsl} from "../../interface/EsQueryDsl";

export class EsPhraseSuggest extends EsAbstractSuggest {
    constructor(name:string, field?:string) {
        super(name, 'phrase');
        if (field) {
            this.setTypeProperty('field', field);
        }
    }

    public field(field:string): EsPhraseSuggest {
        this.setTypeProperty('field', field);
        return this;
    }

    //The suggest text. The suggest text is a required option that needs to be set globally or per suggestion.
    public text(text:string): EsPhraseSuggest {
        this.setTypeProperty('text', text);
        return this;
    }

    //The analyzer to analyse the suggest text with. Defaults to the search analyzer of the suggest field.
    public analyzer(analyzer:any): EsPhraseSuggest {
        this.setTypeProperty('analyzer', analyzer);
        return this;
    }

    //The maximum corrections to be returned per suggest text token.
    public size(value:number): EsPhraseSuggest {
        this.setTypeProperty('size', value);
        return this;
    }

    public gramSize(value:number): EsPhraseSuggest {
        this.setTypeProperty('gram_size', value);
        return this;
    }

    public separator(value:string): EsPhraseSuggest {
        this.setTypeProperty('separator', value);
        return this;
    }

    public highlight(preTag:string, postTag:string): EsPhraseSuggest {
        this.setTypeProperty('highlight', {pre_tag: preTag})
        this.setTypeProperty('highlight', {post_tag: postTag})
        return this;
    }

    public addGenerator(generator:EsSuggestDirectCandidateGenerator): EsPhraseSuggest {
        this.addTypeProperty('direct_generator', generator.build());
        return this;
    }

    /*
    The suggest mode controls what suggestions are included or controls for what suggest text phrases, suggestions should be suggested. Three possible values can be specified:
    - missing: Only provide suggestions for suggest text phrases that are not in the index. This is the default.
    - popular: Only suggest suggestions that occur in more docs than the original suggest text phrase.
    - always: Suggest any matching suggestions based on phrases in the suggest text.
    */
    public modeMissing(): EsPhraseSuggest {
        this.setTypeProperty('suggest_mode', 'missing');
        return this;
    }
    public modePopular(): EsPhraseSuggest {
        this.setTypeProperty('suggest_mode', 'popular');
        return this;
    }
    public modeAlways(): EsPhraseSuggest {
        this.setTypeProperty('suggest_mode', 'always');
        return this;
    }

}
