import { expect } from 'chai';

import resourceUtils from 'utils/resourceUtils';

describe('utils/resourceUtils', () => {
  describe('getLongName', () => {
    const unit = { name: { fi: 'Kiinteistö A' } };
    const resource = { name: { fi: 'Tila B' } };

    it('returns correct string', () => {
      const actual = resourceUtils.getLongName(resource, unit);
      expect(actual).to.equal('Kiinteistö A / Tila B');
    });

    it('returns null when resource is missing', () => {
      const actual = resourceUtils.getLongName(null, unit);
      expect(actual).to.be.null;
    });

    it('returns null when unit is missing', () => {
      const actual = resourceUtils.getLongName(resource, null);
      expect(actual).to.be.null;
    });
  });
});
