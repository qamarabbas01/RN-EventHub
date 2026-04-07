import { toFriendlyError } from '@/utils/errors';

describe('toFriendlyError', () => {
  it('maps common auth errors to friendly messages', () => {
    expect(toFriendlyError({ code: 'auth/invalid-email' }).message).toMatch(/doesn’t look valid|doesn't look valid/i);
    expect(toFriendlyError({ code: 'auth/wrong-password' }).message).toMatch(/incorrect/i);
    expect(toFriendlyError({ code: 'auth/network-request-failed' }).title).toMatch(/network/i);
  });

  it('cleans up raw Firebase messages', () => {
    const friendly = toFriendlyError({ message: 'Firebase: Error (auth/invalid-email).' }, 'Oops');
    expect(friendly.title).toBe('Oops');
    expect(friendly.message.toLowerCase()).not.toContain('firebase:');
  });
});

