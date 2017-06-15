import pick from 'lodash/pick';
import size from 'lodash/size';
import { expect } from 'chai';
import moment from 'moment';
import simple from 'simple-mock';

import { getState } from 'utils/testUtils';
import { doUpdateCateringOrder, mergeProps, selector } from './ReservationEditFormContainer';

describe('shared/reservation-form/ReservationEditFormContainer', () => {
  const reservation = {
    begin: '2017-04-26T10:00:00+03:00',
    end: '2017-04-26T15:30:00+03:00',
    eventDescription: 'description',
    eventSubject: 'Tivin osastokokous',
    hostName: 'Markku Raitio',
    id: 123,
    numberOfParticipants: 30,
    reserverEmailAddress: 'email@example.com',
    reserverName: 'Jutta Laurila',
    reserverPhoneNumber: '123456789',
    resource: 'abc123',
    state: 'confirmed',
  };

  const cateringOrder = {
    createdAt: '2017-01-01T18:01:04.123',
    invoicingData: 'abc123',
    message: 'Hello!',
    order: {
      2: 10,
    },
    servingTime: '18:30',
  };

  const resource = {
    id: 'abc123',
    name: {
      fi: 'resouceName',
    },
    unit: 'unit123',
  };

  const extraResource = {
    id: 'cba321',
    name: {
      fi: 'extraResouceName',
    },
  };

  const unit = {
    id: 'unit123',
    name: { fi: 'unitName' },
  };

  const cateringProvider = {
    id: 'cat123',
    units: [unit.id],
  };

  const defaultState = {
    data: {
      cateringProviders: {
        cat123: cateringProvider,
      },
      reservations: {
        123: reservation,
      },
      resources: {
        abc123: resource,
        cba321: extraResource,
      },
      units: {
        unit123: unit,
      },
    },
  };

  describe('selector', () => {
    const props = { cateringOrder, initialResource: resource, reservation };
    const time = { begin: { date: '2016-01-01', time: '10:00' } };

    function getSelected(extraState, extraProps) {
      const state = getState({ ...defaultState, ...extraState });
      return selector(state, { ...props, ...extraProps });
    }

    it('returns numberOfParticipants', () => {
      const extraState = {
        'form.resourceReservation.values': {
          numberOfParticipants: 15,
          time,
        },
      };
      expect(getSelected(extraState).numberOfParticipants).to.equal(15);
    });

    describe('initialValues', () => {
      describe('cateringOrder picks cateringOrder prop data needed for form', () => {
        const fields = [
          'invoicingData',
          'message',
          'order',
          'servingTime',
        ];
        const actual = getSelected().initialValues.cateringOrder;
        const expected = pick(cateringOrder, fields);
        expect(size(expected) < size(cateringOrder)).to.be.true;
        expect(actual).to.deep.equal(expected);
      });

      it('time is correct', () => {
        expect(getSelected().initialValues.time).to.deep.equal({
          begin: {
            date: '2017-04-26',
            time: '10:00',
          },
          end: {
            date: '2017-04-26',
            time: '15:30',
          },
        });
      });

      it('eventDescription is reservation.eventDescription', () => {
        expect(getSelected().initialValues.eventDescription).to.equal(reservation.eventDescription);
      });

      it('eventSubject is reservation.eventSubject', () => {
        expect(getSelected().initialValues.eventSubject).to.equal(reservation.eventSubject);
      });

      it('hostName is reservation.hostName', () => {
        expect(getSelected().initialValues.hostName).to.equal(reservation.hostName);
      });

      it('numberOfParticipants is reservation.numberOfParticipants', () => {
        expect(getSelected().initialValues.numberOfParticipants).to.equal(
          reservation.numberOfParticipants
        );
      });

      it('reserverName is reservation.reserverName', () => {
        expect(getSelected().initialValues.reserverName).to.equal(reservation.reserverName);
      });

      it('resource equals initial resource id from props', () => {
        expect(getSelected().initialValues.resource).to.equal(resource.id);
      });
    });

    describe('formDate', () => {
      it('returns date if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).formDate).to.equal('2016-01-01');
      });
    });

    describe('timelineDate', () => {
      it('returns form date if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).timelineDate).to.equal('2016-01-01');
      });

      it('returns reservation start date if no form date', () => {
        expect(getSelected().timelineDate).to.equal(
          moment(reservation.begin).format('YYYY-MM-DD')
        );
      });
    });

    describe('timeRange', () => {
      it('returns time if exists', () => {
        const extraState = {
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).timeRange).to.deep.equal(time);
      });
    });

    describe('resource', () => {
      const resource2 = { id: 'r-2' };

      it('is returned by form value', () => {
        const extraState = {
          'data.resources': {
            [resource.id]: resource,
            'r-2': resource2,
          },
          'form.resourceReservation.values': {
            resource: 'r-2',
            time,
          },
        };
        expect(getSelected(extraState).resource).to.deep.equal(resource2);
      });

      it('is returned by initial value if no form value', () => {
        const extraState = {
          'data.resources': {
            [resource.id]: resource,
            'r-2': resource2,
          },
          'form.resourceReservation.values': {
            time,
          },
        };
        expect(getSelected(extraState).resource).to.deep.equal(resource);
      });
    });

    describe('cateringProvider', () => {
      it('is returned if exists for unit', () => {
        const actual = getSelected().cateringProvider;
        expect(actual).to.deep.equal(cateringProvider);
      });

      it('is not returned if does not exist for unit', () => {
        const extraState = {
          'data.cateringProviders': {},
        };
        const actual = getSelected(extraState).cateringProvider;
        expect(actual).to.be.undefined;
      });
    });
  });

  describe('mergeProps', () => {
    it('merges arguments and adds an onSubmit', () => {
      const actual = mergeProps(
        { a: 1 },
        { b: 2 },
        { c: 3 }
      );
      const { onSubmit, ...rest } = actual;
      expect(onSubmit).to.exist;
      expect(rest).to.deep.equal({ a: 1, b: 2, c: 3 });
    });

    describe('onSubmit', () => {
      function callOnSubmit(props, ...args) {
        const mergedProps = mergeProps({}, {}, props);
        mergedProps.onSubmit(...args);
      }

      it('calls props.editReservation', () => {
        const values = {
          cateringOrder: {
            message: 'Hello!',
            order: { 2: 10 },
          },
          time: {
            begin: { date: '2016-01-01', time: '10:00' },
            end: { date: '2016-01-01', time: '12:00' },
          },
          hostName: 'Han Solo',
          eventDescription: 'Description',
          eventSubject: 'Tapaaminen',
          numberOfParticipants: 8,
          participants: 'participant list',
          reserverName: 'Luke Skywalker',
          resource: 'r-1',
        };

        const editReservation = simple.mock();
        const props = {
          editReservation,
          reservation: { id: 123 },
        };
        callOnSubmit(props, values);
        expect(editReservation.callCount).to.equal(1);
        const args = editReservation.lastCall.args;
        expect(args).to.have.length(2);
        expect(args[0]).to.deep.equal({
          begin: moment('2016-01-01T10:00:00').format(),
          end: moment('2016-01-01T12:00:00').format(),
          event_description: values.eventDescription,
          event_subject: values.eventSubject,
          host_name: values.hostName,
          id: props.reservation.id,
          number_of_participants: values.numberOfParticipants,
          participants: values.participants,
          reserver_name: values.reserverName,
          resource: values.resource,
        });
        expect(args[1].successMeta.cateringOrder).to.deep.equal(values.cateringOrder);
      });
    });

    describe('doUpdateCateringOrder helper function', () => {
      let makeCateringOrder;
      let editCateringOrder;
      let deleteCateringOrder;
      const reservationId = 123;
      const cateringOrderData = {
        id: 45,
        invoicingData: 'abc123',
        order: {
          2: 10,
        },
      };
      const defaultArgs = {
        actionOptions: {
          successMeta: {
            sideEffect: () => null,
          },
        },
        cateringOrder: cateringOrderData,
        initialCateringOrder: cateringOrderData,
      };

      beforeEach(() => {
        makeCateringOrder = simple.mock();
        editCateringOrder = simple.mock();
        deleteCateringOrder = simple.mock();
      });

      afterEach(() => {
        simple.restore();
      });

      function doUpdate(extraArgs) {
        const args = { ...defaultArgs, ...extraArgs };
        const editReservationSuccessAction = {
          payload: {
            id: reservationId,
          },
          meta: {
            cateringOrder: args.cateringOrder,
          },
        };
        const props = {
          cateringOrder: { id: cateringOrderData.id },
          editCateringOrder,
          deleteCateringOrder,
          initialValues: {
            cateringOrder: args.initialCateringOrder,
          },
          makeCateringOrder,
        };
        doUpdateCateringOrder(
          args.actionOptions,
          editReservationSuccessAction,
          props,
        );
      }

      describe('when cateringOrder is added', () => {
        it('calls makeCateringOrder with correct args', () => {
          const args = { initialCateringOrder: null };
          doUpdate(args);
          expect(makeCateringOrder.callCount).to.equal(1);
          expect(makeCateringOrder.lastCall.args[0]).to.deep.equal({
            ...cateringOrderData,
            reservation: reservationId,
          });
          expect(makeCateringOrder.lastCall.args[1]).to.deep.equal(
            defaultArgs.actionOptions
          );
          expect(deleteCateringOrder.callCount).to.equal(0);
          expect(editCateringOrder.callCount).to.equal(0);
        });
      });

      describe('when cateringOrder is removed', () => {
        function createTest(name, order) {
          it(name, () => {
            const args = {
              cateringOrder: {
                ...cateringOrderData,
                order,
              },
            };
            doUpdate(args);
            expect(deleteCateringOrder.callCount).to.equal(1);
            expect(deleteCateringOrder.lastCall.args[0]).to.equal(
              cateringOrderData.id
            );
            expect(deleteCateringOrder.lastCall.args[1]).to.deep.equal({
              ...defaultArgs.actionOptions,
              meta: {
                id: cateringOrderData.id,
                reservationId,
              },
            });
            expect(makeCateringOrder.callCount).to.equal(0);
            expect(editCateringOrder.callCount).to.equal(0);
          });
        }

        createTest('calls deleteCateringOrder with correct args when only zero values exists', { 2: 0 });
        createTest('calls deleteCateringOrder with correct args when no items exist', {});
      });

      describe('when cateringOrder does not change', () => {
        it('just resolves promise', () => {
          const sideEffect = simple.mock();
          const actionOptions = {
            successMeta: {
              sideEffect,
            },
          };
          doUpdate({ actionOptions });
          expect(sideEffect.callCount).to.equal(1);
          expect(makeCateringOrder.callCount).to.equal(0);
          expect(deleteCateringOrder.callCount).to.equal(0);
          expect(editCateringOrder.callCount).to.equal(0);
        });
      });

      describe('when cateringOrder is edited', () => {
        it('calls editCateringOrder with correct args', () => {
          const args = {
            cateringOrder: {
              ...cateringOrderData,
              order: {
                2: 8,
              },
            },
          };
          doUpdate(args);
          expect(editCateringOrder.callCount).to.equal(1);
          expect(editCateringOrder.lastCall.args[0]).to.deep.equal({
            ...args.cateringOrder,
            id: cateringOrderData.id,
            reservation: reservationId,
          });
          expect(editCateringOrder.lastCall.args[1]).to.deep.equal(
            defaultArgs.actionOptions
          );
          expect(makeCateringOrder.callCount).to.equal(0);
          expect(deleteCateringOrder.callCount).to.equal(0);
        });
      });
    });
  });
});
