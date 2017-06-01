import { expect } from 'chai';
import { actionTypes as formActions } from 'redux-form';

import actions from 'actions/recurringReservations';
import reducer, { populateReservations } from './recurringReservationsReducer';

describe('state/recurringReservations', () => {
  describe('reducer', () => {
    const initialState = {
      baseTime: null,
      frequency: 'weeks',
      lastTime: null,
      numberOfOccurrences: 1,
      reservations: [],
    };

    it('returns correct initial state', () => {
      const actual = reducer(undefined, { type: 'NOOP' });
      expect(actual).to.deep.equal(initialState);
    });

    describe('changeBaseTime', () => {
      const changeBaseTime = actions.changeBaseTime;

      it('changes baseTime to action.payload', () => {
        const state = {
          ...initialState,
          frequency: 'days',
        };
        const newTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const actual = reducer(state, changeBaseTime(newTime));
        expect(actual.baseTime).to.deep.equal(newTime);
      });
    });

    describe('changeFrequency', () => {
      const changeFrequency = actions.changeFrequency;

      it('changes frequency to action.payload', () => {
        const state = {
          ...initialState,
          numberOfOccurrences: 12,
        };
        const actual = reducer(state, changeFrequency('days'));
        expect(actual.frequency).to.equal('days');
      });

      it('updates reservations', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: '',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const reservations = reducer(state, changeFrequency('days')).reservations;
        const expected = [{
          begin: '2017-04-19T15:00:00.000Z',
          end: '2017-04-19T16:00:00.000Z',
        }];
        expect(reservations).to.deep.equal(expected);
      });

      it('updates lastTime', () => {
        const baseTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const state = {
          ...initialState,
          baseTime,
          numberOfOccurrences: 1,
        };
        const actual = reducer(state, changeFrequency('weeks'));
        const expectedLastTime = '2017-04-25';
        expect(actual.lastTime).to.deep.equal(expectedLastTime);
      });
    });

    describe('changeNumberOfOccurrences', () => {
      const changeNumberOfOccurrences = actions.changeNumberOfOccurrences;

      it('changes numberOfOccurrences to action.payload', () => {
        const state = {
          ...initialState,
          frequency: 'days',
        };
        const actual = reducer(state, changeNumberOfOccurrences(12));
        expect(actual.numberOfOccurrences).to.equal(12);
      });

      it('updates reservations', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: 'days',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const reservations = reducer(state, changeNumberOfOccurrences(2)).reservations;
        const expected = [
          {
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          },
          {
            begin: '2017-04-20T15:00:00.000Z',
            end: '2017-04-20T16:00:00.000Z',
          },
        ];
        expect(reservations).to.deep.equal(expected);
      });

      it('updates lastTime', () => {
        const baseTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const state = {
          baseTime,
          frequency: 'days',
          numberOfOccurrences: 1,
          lastTime: null,
        };
        const expectedLastTime = '2017-04-20';
        const actual = reducer(state, changeNumberOfOccurrences(2));
        expect(actual.lastTime).to.deep.equal(expectedLastTime);
      });

      it('has a maximum of 1 year', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: 'months',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const actual = reducer(state, changeNumberOfOccurrences(30));
        expect(actual.numberOfOccurrences).to.equal(12);
        expect(actual.lastTime).to.equal('2018-04-18');
        expect(actual.reservations).to.have.length(12);
      });

      it('has a maximum of 100 occurrences', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: 'days',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const actual = reducer(state, changeNumberOfOccurrences(101));
        expect(actual.numberOfOccurrences).to.equal(100);
        expect(actual.lastTime).to.equal('2017-07-27');
        expect(actual.reservations).to.have.length(100);
      });

      describe('changeLastTime', () => {
        const changeLastTime = actions.changeLastTime;

        it('changes lastTime to action.payload', () => {
          const lastTime = '2017-04-18';
          const state = {
            ...initialState,
            lastTime,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.lastTime).to.deep.equal(lastTime);
        });

        it('updates numberOfOccurrences', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2017-04-20';
          const state = {
            baseTime,
            frequency: 'days',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(2);
        });

        it('rounds down the numberOfOccurrences', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2017-04-30';
          const state = {
            baseTime,
            frequency: 'weeks',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(1);
        });

        it('has a maximum of 1 year', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2030-04-30';
          const state = {
            baseTime,
            frequency: 'months',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(12);
          expect(actual.lastTime).to.equal('2018-04-18');
          expect(actual.reservations).to.have.length(12);
        });

        it('has a maximum of 100 occurrences', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2017-07-29';
          const state = {
            baseTime,
            frequency: 'days',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(100);
          expect(actual.lastTime).to.equal('2017-07-27');
          expect(actual.reservations).to.have.length(100);
        });
      });

      describe('removeReservation', () => {
        const removeReservation = actions.removeReservation;
        const reservations = [
          {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          {
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          },
        ];

        it('removes reservation with same begin than payload', () => {
          const state = {
            ...initialState,
            reservations,
          };
          const actual = reducer(state, removeReservation('2017-04-18T15:00:00.000Z'));
          expect(actual.reservations).to.deep.equal([{
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          }]);
        });

        it('does not change reservations if begin time is not in reservations', () => {
          const state = {
            ...initialState,
            reservations,
          };
          const actual = reducer(state, removeReservation('2017-04-17T15:00:00.000Z'));
          expect(actual.reservations).to.deep.equal(reservations);
        });
      });

      describe('redux-form INITIALIZE', () => {
        it('resets state if form is resourceReservation', () => {
          const state = {
            baseTime: { begin: '', end: '' },
            frequency: 'days',
            numberOfOccurrences: 12,
            lastTime: '2017-04-18',
          };
          const action = {
            type: formActions.INITIALIZE,
            meta: {
              form: 'resourceReservation',
            },
          };
          const actual = reducer(state, action);
          expect(actual).to.deep.equal(initialState);
        });

        it('does not change state if some other form', () => {
          const state = {
            baseTime: { begin: '', end: '' },
            frequency: 'days',
            numberOfOccurrences: 12,
            lastTime: '2017-04-18',
          };
          const action = {
            type: formActions.INITIALIZE,
            meta: {
              form: 'someForm',
            },
          };
          const actual = reducer(state, action);
          expect(actual).to.deep.equal(state);
        });
      });
    });
  });

  describe('populateReservations helper function', () => {
    function getReservations(state) {
      const defaults = {
        baseTime: null,
        frequency: '',
        numberOfOccurrences: 1,
      };
      return populateReservations({ ...defaults, ...state });
    }

    it('returns an empty array if baseTime is not set', () => {
      const reservations = getReservations({ baseTime: null, frequency: 'days' });
      expect(reservations).to.deep.equal([]);
    });

    it('returns an empty array if frequency is not set', () => {
      const reservations = getReservations({ baseTime: { foo: 'bar' }, frequency: '' });
      expect(reservations).to.deep.equal([]);
    });

    it('populates reservations correctly when frequency is "days"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'days';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-04-19T15:00:00.000Z',
          end: '2017-04-19T16:00:00.000Z',
        },
        {
          begin: '2017-04-20T15:00:00.000Z',
          end: '2017-04-20T16:00:00.000Z',
        },
        {
          begin: '2017-04-21T15:00:00.000Z',
          end: '2017-04-21T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
    });

    it('populates reservations correctly when frequency is "weeks"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'weeks';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-04-25T15:00:00.000Z',
          end: '2017-04-25T16:00:00.000Z',
        },
        {
          begin: '2017-05-02T15:00:00.000Z',
          end: '2017-05-02T16:00:00.000Z',
        },
        {
          begin: '2017-05-09T15:00:00.000Z',
          end: '2017-05-09T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
    });

    it('populates reservations correctly when frequency is "months"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'months';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-05-18T15:00:00.000Z',
          end: '2017-05-18T16:00:00.000Z',
        },
        {
          begin: '2017-06-18T15:00:00.000Z',
          end: '2017-06-18T16:00:00.000Z',
        },
        {
          begin: '2017-07-18T15:00:00.000Z',
          end: '2017-07-18T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
    });
  });
});
