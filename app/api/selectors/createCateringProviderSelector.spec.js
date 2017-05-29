import { expect } from 'chai';

import createCateringProviderSelector from './createCateringProviderSelector';

const providers = {
  1: { id: 1, name: 'Provider 1', units: ['u1', 'u2'] },
  2: { id: 2, name: 'Provider 2', units: ['u3'] },
  3: { id: 3, name: 'Provider 3', units: ['u4', 'u5'] },
};

function getState() {
  return { data: { cateringProviders: providers } };
}

describe('api/selectors/createCateringProviderSelector', () => {
  it('returns a function', () => {
    expect(createCateringProviderSelector(() => null)).to.be.a('function');
  });

  describe('created selector', () => {
    it('returns provider by unit id', () => {
      const unitIdSelector = () => 'u5';
      const actual = createCateringProviderSelector(unitIdSelector)(getState());
      expect(actual).to.deep.equal({ id: 3, name: 'Provider 3', units: ['u4', 'u5'] });
    });

    it('returns undefined if unit not found', () => {
      const unitIdSelector = () => 'u100';
      const actual = createCateringProviderSelector(unitIdSelector)(getState());
      expect(actual).to.be.undefined;
    });
  });
});
