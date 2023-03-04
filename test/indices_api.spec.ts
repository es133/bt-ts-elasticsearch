import {
    EsIndicesApiBuilder,
} from "../src/BtElasticSearch";
import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';

describe('TEST ES indices operation', ()=> {

    //Init dao
    const esConfig = new BtEsAbstractConfig(config['esClientService']);
    console.log('ES CONFIG:', esConfig);
    let tbEsAbstractDao = new BtEsAbstractDao(esConfig);

    const mapping = {
        "settings": {
            "index": {
                "number_of_shards": "2",
                "number_of_replicas": "0"
            }
        },
        "mappings": {
            "dynamic": false,
            "properties": {
                "id": { "type": "integer" },
                "title": { "type": "text", "index": false },
                "content": { "type": "text", "index": false }
            }
        }
    }

    let result = null;

    it('CreateIndex 1', async ()=> {
        result = await tbEsAbstractDao.createIndex('test', mapping);
        console.log('============ CREATE INDEX RESULT:', result);
    });

    it('CreateIndex 2', async ()=> {
        result = await tbEsAbstractDao.createIndex('test_1', mapping);
        console.log('============ CREATE INDEX RESULT:', result);
    });

    it('Exists index', async ()=> {
        result = await tbEsAbstractDao.indexExists('test');
        console.log('============ INDEX Exists RESULT:', result);
    });

    it('Exists alias', async ()=> {
        result = await tbEsAbstractDao.existsAlias('test_alias');
        console.log('============ Exists alias RESULT:', result);
    });

    it('Put alias', async ()=> {
        result = await tbEsAbstractDao.putAlias('test', 'test_alias');
        console.log('============ put alias RESULT:', result);
    });

    it('Get alias', async ()=> {
        result = await tbEsAbstractDao.getIndexListWithAliasName('test_alias');
        console.log('============ get index list RESULT:', result);
    });

    it('Exchange alias', async ()=> {
        result = await tbEsAbstractDao.exchangeAlias(['test_1'], ['test'], 'test_alias');
        console.log('============ get alias RESULT:', result);
    });

    it('Delete alias', async ()=> {
        result = await tbEsAbstractDao.deleteAlias('test_1', 'test_alias');
        console.log('============ get alias RESULT:', result);
    });

    it('Test ANALYZE API', async ()=> {
        const analyzeRequest = EsIndicesApiBuilder.indicesAnalyzeApi('test');
        analyzeRequest.text('This is test text for testing analyze api');
        analyzeRequest.analyzer('standard');
        result = await tbEsAbstractDao.requestAnalyze(analyzeRequest);
        console.log('============ ANALYZE API RESULT:', result);
    });

    it('Delete Index 1', async ()=> {
        result = await tbEsAbstractDao.deleteIndex('test');
        console.log('============ Delete INDEX RESULT:', result);
    });

    it('Delete Index 2', async ()=> {
        result = await tbEsAbstractDao.deleteIndex('test_1');
        console.log('============ Delete INDEX RESULT:', result);
    });


});
