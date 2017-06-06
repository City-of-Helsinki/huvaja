import { expect } from 'chai';

import schemas from './schemas';
import {
  buildAPIUrl,
  buildUrl,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getReportHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessPayload,
  getSuccessTypeDescriptor,
  requiredHeaders,
} from './utils';

describe('api/actions/utils', () => {
  describe('buildAPIUrl', () => {
    const endpoint = 'some/endpoint';
    const isAbsolute = false;

    it('returns API_URL + given endpoint if params is empty', () => {
      const expected = `${SETTINGS.API_URL}${endpoint}/`;

      expect(buildAPIUrl(endpoint, {}, isAbsolute)).to.equal(expected);
    });

    it('rejects params with empty values', () => {
      const params = { empty: '' };
      const expected = `${SETTINGS.API_URL}${endpoint}/`;

      expect(buildAPIUrl(endpoint, params, isAbsolute)).to.equal(expected);
    });

    it('appends search params at the end if params is not empty', () => {
      const params = { param: 'hello_world' };
      const expected = `${SETTINGS.API_URL}${endpoint}/?param=hello_world`;

      expect(buildAPIUrl(endpoint, params, isAbsolute)).to.equal(expected);
    });

    it('supports absolute urls', () => {
      const expected = `${endpoint}/`;

      expect(buildAPIUrl(endpoint, {}, true)).to.equal(expected);
    });
  });

  describe('buildUrl', () => {
    it('returns correct url', () => {
      const base = 'http://base.fi/';
      const endpoint = 'some/endpoint';
      const params = { empty: '', someParam: 'hello_world' };
      const actual = buildUrl(base, endpoint, params);
      const expected = 'http://base.fi/some/endpoint/?some_param=hello_world';
      expect(actual).to.equal(expected);
    });
  });

  describe('createTransformFunction', () => {
    it('returns a function', () => {
      expect(typeof createTransformFunction()).to.equal('function');
    });

    describe('the returned function', () => {
      it('camelizes object keys', () => {
        const transformFunction = createTransformFunction();
        const initial = {
          some_key: {
            nested_key: 'value',
          },
        };
        const expected = {
          someKey: {
            nestedKey: 'value',
          },
        };

        expect(transformFunction(initial)).to.deep.equal(expected);
      });

      describe('if normalizr Schema is provided', () => {
        it('uses the Schema to normalize data', () => {
          const transformFunction = createTransformFunction(schemas.resourceSchema);
          const initialResourceData = {
            id: 'r-1',
            unit: {
              id: 'u-1',
            },
          };
          const expectedResourceData = {
            entities: {
              resources: {
                'r-1': { id: 'r-1', unit: 'u-1' },
              },
              units: {
                'u-1': { id: 'u-1' },
              },
            },
            result: 'r-1',
          };

          expect(transformFunction(initialResourceData)).to.deep.equal(expectedResourceData);
        });
      });
    });
  });

  describe('getErrorTypeDescriptor', () => {
    const actionType = 'SOME_GET_ERROR';

    it('returns an object', () => {
      expect(typeof getErrorTypeDescriptor(actionType)).to.equal('object');
    });

    it('contains the given action type', () => {
      const actual = getErrorTypeDescriptor(actionType).type;

      expect(actual).to.equal(actionType);
    });

    it('contains meta object with given data', () => {
      const options = { meta: { foo: 'bar' }, errorMeta: { some: 'value' } };
      const actual = getErrorTypeDescriptor(actionType, options).meta;
      const expected = { foo: 'bar', some: 'value' };
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getHeadersCreator', () => {
    it('returns a function', () => {
      expect(typeof getHeadersCreator()).to.equal('function');
    });

    describe('the returned function', () => {
      describe('when user is logged in', () => {
        const state = {
          auth: {
            token: 'mock-token',
          },
        };
        const authorizationHeader = { Authorization: 'JWT mock-token' };

        describe('if no additional headers are specified', () => {
          it('returns the required headers and Authorization header', () => {
            const creator = getHeadersCreator();
            const expected = Object.assign(
              {},
              requiredHeaders,
              authorizationHeader
            );

            expect(creator(state)).to.deep.equal(expected);
          });
        });

        describe('if additional headers are specified', () => {
          it('returns the required, the additional and Authorization headers', () => {
            const additionalHeaders = {
              header: 'value',
            };
            const creator = getHeadersCreator(additionalHeaders);
            const expected = Object.assign(
              {},
              requiredHeaders,
              additionalHeaders,
              authorizationHeader
            );

            expect(creator(state)).to.deep.equal(expected);
          });
        });
      });

      describe('when user is logged out', () => {
        const state = {
          auth: {},
        };

        describe('if no additional headers are specified', () => {
          it('returns the just the required headers', () => {
            const creator = getHeadersCreator();

            expect(creator(state)).to.deep.equal(requiredHeaders);
          });
        });

        describe('if additional headers are specified', () => {
          it('returns the required headers and the additional headers', () => {
            const additionalHeaders = {
              header: 'value',
            };
            const creator = getHeadersCreator(additionalHeaders);
            const expected = Object.assign({}, requiredHeaders, additionalHeaders);

            expect(creator(state)).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('getReportHeadersCreator', () => {
    it('returns a function', () => {
      expect(typeof getReportHeadersCreator()).to.equal('function');
    });

    describe('the returned function', () => {
      describe('when user is logged in', () => {
        const state = {
          auth: {
            token: 'mock-token',
          },
        };
        const authorizationHeader = { Authorization: 'JWT mock-token' };

        describe('if additional headers are specified', () => {
          it('returns the required, the additional and Authorization headers without Accept and Content-Type', () => {
            const additionalHeaders = {
              header: 'value',
            };
            const creator = getReportHeadersCreator(additionalHeaders);
            const expected = Object.assign(
              {},
              requiredHeaders,
              additionalHeaders,
              authorizationHeader
            );
            delete expected.Accept;
            delete expected['Content-Type'];

            expect(creator(state)).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('getRequestTypeDescriptor', () => {
    const actionType = 'SOME_GET_REQUEST';

    it('returns an object', () => {
      expect(typeof getRequestTypeDescriptor(actionType)).to.equal('object');
    });

    it('contains the given action type', () => {
      const actual = getRequestTypeDescriptor(actionType).type;

      expect(actual).to.equal(actionType);
    });

    it('contains a meta object with given data', () => {
      const options = { meta: { foo: 'bar' }, requestMeta: { some: 'value' } };
      const actual = getRequestTypeDescriptor(actionType, options).meta;
      const expected = { foo: 'bar', some: 'value' };
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getSuccessPayload', () => {
    it('returns a function', () => {
      expect(typeof getSuccessPayload({})).to.equal('function');
    });

    describe('the returned function', () => {
      it('returns response if rawResponse in options', () => {
        const options = { rawResponse: true };
        const func = getSuccessPayload(options);
        const response = { some: 'data' };
        const actual = func(null, null, response);
        expect(actual).to.deep.equal(response);
      });
    });
  });

  describe('getSuccessTypeDescriptor', () => {
    const actionType = 'SOME_GET_SUCCESS';

    it('returns an object', () => {
      expect(typeof getSuccessTypeDescriptor(actionType)).to.equal('object');
    });

    it('contains the given action type', () => {
      const actual = getSuccessTypeDescriptor(actionType).type;

      expect(actual).to.equal(actionType);
    });

    it('contains a payload function', () => {
      expect(typeof getSuccessTypeDescriptor(actionType).payload).to.equal('function');
    });

    it('contains a meta object with given data', () => {
      const options = { meta: { foo: 'bar' }, successMeta: { some: 'value' } };
      const actual = getSuccessTypeDescriptor(actionType, options).meta;
      const expected = { foo: 'bar', some: 'value' };
      expect(actual).to.deep.equal(expected);
    });

    it('supports adding payload property', () => {
      const typeDescriptor = getSuccessTypeDescriptor(actionType, { payload: 'mock-payload' });
      expect(typeDescriptor.payload).to.equal('mock-payload');
    });
  });
});
