import { expect } from 'chai';

import schemas from './schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
  requiredHeaders,
} from './createApiAction';

describe('api/actions/createApiAction', () => {
  describe('buildAPIUrl', () => {
    const endpoint = 'some/endpoint';

    it('returns API_URL + given endpoint if params is empty', () => {
      const expected = `${SETTINGS.API_URL}${endpoint}/`;

      expect(buildAPIUrl(endpoint)).to.equal(expected);
    });

    it('rejects params with empty values', () => {
      const params = { empty: '' };
      const expected = `${SETTINGS.API_URL}${endpoint}/`;

      expect(buildAPIUrl(endpoint, params)).to.equal(expected);
    });

    it('appends search params at the end if params is not empty', () => {
      const params = { param: 'hello_world' };
      const expected = `${SETTINGS.API_URL}${endpoint}/?param=hello_world`;

      expect(buildAPIUrl(endpoint, params)).to.equal(expected);
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
