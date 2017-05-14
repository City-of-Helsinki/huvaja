import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './resourceSelectorModalSelector';

describe('shared/modals/resource-selector/resourceSelectorModalSelector', () => {
  const props = {
    selectedResource: {
      id: 'qwerty',
      unit: 'u-2',
    },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };

  function getSelected() {
    const state = getState({
      'data.units': units,
      'modals.resourceSelector': { show: true },
    });
    return selector(state, props);
  }

  it('returns selectedResource', () => {
    const actual = getSelected().selectedResource;
    expect(actual).to.equal(props.selectedResource);
  });

  it('returns show', () => {
    const actual = getSelected().show;
    expect(actual).to.be.true;
  });

  it('returns unit', () => {
    const actual = getSelected().unit;
    expect(actual).to.deep.equal(units['u-2']);
  });
});
