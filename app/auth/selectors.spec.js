import { expect } from 'chai';

import { currentUserSelector } from './selectors';

function getState(user) {
  return { auth: { token: 'mock-token', user } };
}

describe('auth/selectors', () => {
  describe('currentUserSelector', () => {
    it('returns null if user does not exist', () => {
      const user = null;
      const selected = currentUserSelector(getState(user));
      expect(selected).to.equal(null);
    });

    it('returns user data if user does exist', () => {
      const user = { id: 'u-1', firstName: 'Luke' };
      const selected = currentUserSelector(getState(user));
      expect(selected.id).to.equal(user.id);
      expect(selected.firstName).to.equal(user.firstName);
    });

    describe('displayName', () => {
      it('returns full name if user has firstName and/or lastName', () => {
        const user = { firstName: 'Luke', lastName: 'Skywalker' };
        const selected = currentUserSelector(getState(user));
        expect(selected.displayName).to.equal('Luke Skywalker');
      });

      it('returns username if user does not have firstName and lastName', () => {
        const user = { firstName: '', lastName: '', username: 'skywalk' };
        const selected = currentUserSelector(getState(user));
        expect(selected.displayName).to.equal('skywalk');
      });

      it('returns email if user does not have name or username', () => {
        const user = {
          emails: [{ value: 'luke@skywalker.com' }],
          firstName: '',
          lastName: '',
          username: '',
        };
        const selected = currentUserSelector(getState(user));
        expect(selected.displayName).to.equal('luke@skywalker.com');
      });
    });

    describe('email', () => {
      it('returns an empty string if user does not have emails', () => {
        const user = { emails: [] };
        const selected = currentUserSelector(getState(user));
        expect(selected.email).to.equal('');
      });

      it('returns the value of the email if user has an email', () => {
        const user = { emails: [{ value: 'luke@skywalker.com' }] };
        const selected = currentUserSelector(getState(user));
        expect(selected.email).to.equal('luke@skywalker.com');
      });

      it('returns the value of the first email if user has multiple emails', () => {
        const user = {
          emails: [
            { value: 'luke@skywalker.com' },
            { value: 'luke.skywalker@gmail.com' },
          ],
        };
        const selected = currentUserSelector(getState(user));
        expect(selected.email).to.equal('luke@skywalker.com');
      });
    });
  });
});
