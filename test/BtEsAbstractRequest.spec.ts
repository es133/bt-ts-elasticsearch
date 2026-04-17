import { BtEsAbstractRequest } from '../src/bt_es_request/BtEsAbstractRequest';
import { ES_VERSION_TYPE } from '../src/type/BtEsEnums';

describe('BtEsAbstractRequest', () => {

    describe('setSource', () => {
        it('should set _source to true when boolean true is passed', () => {
            const request = new BtEsAbstractRequest();
            request.setSource(true);

            expect(request.getParam()._source).toBe(true);
        });

        it('should set _source to false when boolean false is passed', () => {
            const request = new BtEsAbstractRequest();
            request.setSource(false);

            expect(request.getParam()._source).toBe(false);
        });

        it('should set _source to an array of fields', () => {
            const request = new BtEsAbstractRequest();
            request.setSource(['title', 'content']);

            expect(request.getParam()._source).toEqual(['title', 'content']);
        });
    });

    describe('setVersion / setVersionType', () => {
        it('should set version independently from version_type', () => {
            const request = new BtEsAbstractRequest();
            request.setVersion(true);
            request.setVersionType(ES_VERSION_TYPE.EXTERNAL);

            const param = request.getParam();
            expect(param.version).toBe(true);
            expect(param.version_type).toBe('external');
        });

        it('should not overwrite version when setting version_type', () => {
            const request = new BtEsAbstractRequest();
            request.setVersion(true);
            request.setVersionType(ES_VERSION_TYPE.INTERNAL);

            expect(request.getParam().version).toBe(true);
        });
    });
});
