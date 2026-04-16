'use strict';

import {EsAbstractQueryDsl} from './EsAbstractQueryDsl';

export class EsMoreLikeThisQuery extends EsAbstractQueryDsl {

    constructor(fields: string[], like: any) {
        super('more_like_this');
        this.setProperty('fields', fields);
        this.setProperty('like', like);
    }

    public fields(fields: string[]): EsMoreLikeThisQuery {
        this.setProperty('fields', fields);
        return this;
    }

    public like(like: any): EsMoreLikeThisQuery {
        this.setProperty('like', like);
        return this;
    }

    public unlike(unlike: any): EsMoreLikeThisQuery {
        this.setProperty('unlike', unlike);
        return this;
    }

    public minTermFreq(value: number): EsMoreLikeThisQuery {
        this.setProperty('min_term_freq', value);
        return this;
    }

    public maxQueryTerms(value: number): EsMoreLikeThisQuery {
        this.setProperty('max_query_terms', value);
        return this;
    }

    public minDocFreq(value: number): EsMoreLikeThisQuery {
        this.setProperty('min_doc_freq', value);
        return this;
    }

    public maxDocFreq(value: number): EsMoreLikeThisQuery {
        this.setProperty('max_doc_freq', value);
        return this;
    }

    public minWordLength(value: number): EsMoreLikeThisQuery {
        this.setProperty('min_word_length', value);
        return this;
    }

    public maxWordLength(value: number): EsMoreLikeThisQuery {
        this.setProperty('max_word_length', value);
        return this;
    }

    public stopWords(words: string[]): EsMoreLikeThisQuery {
        this.setProperty('stop_words', words);
        return this;
    }

    public analyzer(analyzer: string): EsMoreLikeThisQuery {
        this.setProperty('analyzer', analyzer);
        return this;
    }

    public minimumShouldMatch(value: any): EsMoreLikeThisQuery {
        this.setProperty('minimum_should_match', value);
        return this;
    }

    public boostTerms(value: number): EsMoreLikeThisQuery {
        this.setProperty('boost_terms', value);
        return this;
    }

    public include(value: boolean): EsMoreLikeThisQuery {
        this.setProperty('include', value);
        return this;
    }

    public boost(value: number): EsMoreLikeThisQuery {
        this.setProperty('boost', value);
        return this;
    }
}
