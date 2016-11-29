import { expect } from 'chai';

import { selector } from './NavbarContainer';

function getState() {
  return {
    auth: {
      token: 'mock-token',
      user: { id: 'u-1' },
    },
  };
}

describe('shared/navbar/NavbarContainer', () => {
  describe('selector', () => {
    it('returns user from the state', () => {
      const selected = selector(getState());
      expect(selected.user).to.exist;
    });
  });
});
