import { expect } from 'chai';

import cateringUtils from 'utils/cateringUtils';

describe('utils/cateringUtils', () => {
  const cateringOrder = {
    invoincingData: '123',
    orderLines: [
      { product: 3, quantity: 10 },
    ],
  };
  const formValue = {
    invoincingData: '123',
    order: {
      3: 10,
    },
  };

  describe('formatServingTime', () => {
    it('returns time in correct format', () => {
      const actual = cateringUtils.formatServingTime('09:30:00');
      expect(actual).to.equal('9:30');
    });
  });

  describe('getServingTimeText', () => {
    it('returns formatted serving time when serving time exists', () => {
      const actual = cateringUtils.getServingTimeText('09:30:00');
      expect(actual).to.equal('9:30');
    });

    it('returns text when serving time is null', () => {
      const actual = cateringUtils.getServingTimeText(null);
      expect(actual).to.equal('Varauksen alkamisaika');
    });
  });

  describe('cateringOrderToFormValue', () => {
    it('changes orderLines to order object', () => {
      const actual = cateringUtils.cateringOrderToFormValue(cateringOrder);
      expect(actual).to.deep.equal(formValue);
    });
  });

  describe('formValueToCateringOrder', () => {
    it('changes orderLines to order object', () => {
      const actual = cateringUtils.formValueToCateringOrder(formValue);
      expect(actual).to.deep.equal(cateringOrder);
    });
  });
});
