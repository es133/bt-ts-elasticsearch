'use strict';

import { EsScoreFunctionScript} from './EsScoreFunctionScript';
import { EsScoreFunctionRandom } from './EsScoreFunctionRandom'
import { EsScoreFunctionDecay} from './EsScoreFunctionDecay'
import {EsQueryDsl} from "../interface/EsQueryDsl";

export class EsScoreFunctionBuilder {
    static script (script?:any): EsQueryDsl {
        return new EsScoreFunctionScript(script);
    }
    static random (seed?:number, field?:string):EsScoreFunctionRandom {
        return new EsScoreFunctionRandom(seed, field);
    }
    static DecayLinear(name:string, field:string, origin?:string, scale?:string, offset?:string, decay?:number, multiValueMode?:string):EsScoreFunctionDecay {
        return new EsScoreFunctionDecay('linear', field, origin, scale, offset, decay, multiValueMode);
    }
    static DecayGauss(name:string, field:string, origin?:string, scale?:string, offset?:string, decay?:number, multiValueMode?:string): EsScoreFunctionDecay {
        return new EsScoreFunctionDecay('gauss', field, origin, scale, offset, decay, multiValueMode);
    }
    static DecayExp(name:string, field:string, origin?:string, scale?:string, offset?:string, decay?:number, multiValueMode?:string): EsScoreFunctionDecay {
        return new EsScoreFunctionDecay('exp', field, origin, scale, offset, decay, multiValueMode);
    }
}