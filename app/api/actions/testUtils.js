import { expect } from 'chai';
import forIn from 'lodash/forIn';
import { CALL_API } from 'redux-api-middleware';

function createApiTest(options) {
  /** Create some tests for an API action.
   *
   * Options can be an object like this:
   * {
   *  name: name of test (string),
   *  action: action creator (function),
   *  args: arguments for the action creator (array),
   *  tests: {
   *    method: HTTP method (string),
   *    endpoint: URL (string),
   *    headers: request headers (object)
   *    body: request body (string)
   *    meta: meta of the action (object)
   *    request: {
   *      type: request action type (string),
   *      hasSideEffect: (boolean)
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *    success: {
   *      type: success action type (string),
   *      hasSideEffect: (boolean)
   *      payload: {
   *        data: payload response data (json-like)
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *    error: {
   *      type: error action type (string),
   *      hasSideEffect: (boolean),
   *      extra: {
   *        tests: {
   *          (testName): ({ payload, promise, response }, (done)) (function)
   *        }
   *      }
   *    },
   *  },
   * }
   */
  const tests = options.tests;
  describe(options.name, () => {
    let action;
    let callAPI;

    before(() => {
      action = options.action.apply(null, options.args);
      callAPI = action[CALL_API];
    });

    it('returns an object with a CALL_API key', () => {
      expect(callAPI).to.exist;
    });

    tests.method && it(`uses ${tests.method}`, () => {
      expect(callAPI.method).to.equal(tests.method);
    });

    tests.body && it('has correct body', () => {
      const body = (
        tests.body instanceof Object ?
          JSON.parse(callAPI.body) :
          callAPI.body
      );
      expect(body).to.deep.equal(tests.body);
    });

    tests.endpoint && it('uses correct endpoint', () => {
      expect(callAPI.endpoint).to.equal(tests.endpoint);
    });

    tests.meta && it('has correct meta', () => {
      expect(action.meta).to.deep.equal(tests.meta);
    });

    describe('types', () => {
      const mockAction = {
        [CALL_API]: {
          types: [{ type: (
            (tests.request && tests.request.type) || 'Specify request.type'
          ) }],
        },
      };

      ['request', 'success', 'error'].forEach((actionTypeName, index) => {
        tests[actionTypeName] && describe(actionTypeName, () => {
          const actionTests = tests[actionTypeName];
          const extraTests = actionTests.extra && actionTests.extra.tests;
          let typeAction;
          before(() => {
            typeAction = callAPI.types[index];
          });

          actionTests.type && it('has correct type', () => {
            expect(typeAction.type).to.equal(actionTests.type);
          });

          extraTests && forIn(extraTests, (value, name) => {
            const getParams = () => ({
              typeAction,
              mockAction,
              meta: typeAction.meta,
            });
            const func = (
              value.length === 2 ?
              done => value(getParams(), done) :
              () => value(getParams())
            );
            it(name, func);
          });

          actionTypeName === 'success' && describe('payload', () => {
            let payload;
            let response;
            let promise;
            const payloadTests = actionTests.payload || {};
            const jsonData = payloadTests.data || {};

            before(() => {
              payload = typeAction.payload;
              response = {
                headers: {
                  get: () => 'application/json',
                },
                json: () => Promise.resolve(jsonData),
              };
            });

            beforeEach(() => {
              promise = payload({ type: actionTests.type }, {}, response);
            });

            it('exists', () => {
              expect(payload).to.exist;
            });

            payloadTests.tests && forIn(payloadTests.tests, (value, name) => {
              const func = (
                value.length === 2 ?
                done => value({ promise, payload, response }, done) :
                () => value({ promise, payload, response })
              );
              it(name, func);
            });
          });
        });
      });
    });
  });
}

export {
  createApiTest,  // eslint-disable-line import/prefer-default-export
};
