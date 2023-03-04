import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';
import {EsIngestApiBuilder} from "../src/es_ingest_api/EsIngestApiBuilder";

describe('TEST ES Ingest API', ()=> {

    //Init dao
    const esConfig = new BtEsAbstractConfig(config['esClientService']);
    console.log('ES CONFIG:', esConfig);
    let tbEsAbstractDao = new BtEsAbstractDao(esConfig);

    let result = null;

    it('Test Simulate API', async ()=> {
        const simulateRequest = EsIngestApiBuilder.simulatePipelineApi();
        simulateRequest.addDocument({_source: {text:'Hello world'}});
        simulateRequest.addProcessor( {
            inference:{
                model_id:'lang_ident_model_1',
                inference_config:{
                    'classification':{
                        'num_top_classes':5
                    }
                },
                field_map:{ }
            }
        });
        result = await tbEsAbstractDao.ingestSimulate(simulateRequest);
        console.log('============ SIMULATE API RESULT:', result);
    });


});
