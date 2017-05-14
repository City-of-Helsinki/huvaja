import { expect } from 'chai';

import reducer from './resourceSelectorReducer';

describe('state/reducers/resourceSelectorReducer', () => {
  const initialState = {
    availableResourceIds: [],
  };

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('RESOURCES_GET_SUCCESS', () => {
    function getAction(meta) {
      return {
        type: 'RESOURCES_GET_SUCCESS',
        payload: {
          entities: {
            resources: {
              abc: {},
              def: {},
            },
          },
        },
        meta,
      };
    }

    describe('with meta.resourceSelector = true', () => {
      const action = getAction({ resourceSelector: true });

      it('updates availableResourceIds', () => {
        const oldState = { availableResourceIds: ['qwerty'] };
        const actual = reducer(oldState, action);
        const expected = ['abc', 'def'];
        expect(actual.availableResourceIds).to.deep.equal(expected);
      });
    });

    describe('without meta', () => {
      const action = getAction();

      it('returns current state', () => {
        const oldState = { availableResourceIds: ['qwerty'] };
        const actual = reducer(oldState, action);
        expect(actual).to.deep.equal(oldState);
      });
    });
  });

  describe('CLEAR_RESOURCE_SELECTOR', () => {
    it('resets state', () => {
      const actual = reducer({ availableResourceIds: ['abc'] }, {
        type: 'CLEAR_RESOURCE_SELECTOR',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });
});
