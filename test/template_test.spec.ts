import {BtEsAbstractDao} from "../src/BtElasticSearch";
import { BtEsAbstractConfig } from "../src/BtElasticSearch";
import {config} from './es-config';

describe('TEST ES indices operation', ()=> {

    //Init dao
    const esConfig = new BtEsAbstractConfig(config['esClientService']);
    console.log('ES CONFIG:', esConfig);
    let tbEsAbstractDao = new BtEsAbstractDao(esConfig);

    const template =
        {
            "template": "test_template_*",
            "settings": {
                "index": {
                    "number_of_shards": "2",
                    "number_of_replicas": "0"
                }
            }
        };

    let result = null;

    it('CREATE TEMPLATE', async ()=> {
        result = await tbEsAbstractDao.createTemplate('test_template', template);
        console.log('============ CREATE TEMPLATE RESULT:', result);
    });

    it('DELETE TEMPLATE', async ()=> {
        result = await tbEsAbstractDao.deleteTemplate('test_template');
        console.log('============ DELETE TEMPLATE RESULT:', result);
    });

});