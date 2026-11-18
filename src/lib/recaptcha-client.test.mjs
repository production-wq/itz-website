import assert from 'node:assert/strict';
import test from 'node:test';
import { contactCaptchaToken } from './recaptcha-client.ts';

test('accepts the Google thenable without requiring Promise.finally on it', async () => {
  const previous = globalThis.window;
  let cleared = false;
  globalThis.window = {
    setTimeout: () => 1,
    clearTimeout: () => { cleared = true; },
    grecaptcha: {
      ready: callback => callback(),
      execute: () => ({ then: resolve => resolve('verified-token') }),
    },
  };
  try {
    assert.equal(await contactCaptchaToken('site-key'), 'verified-token');
    await Promise.resolve();
    assert.equal(cleared, true);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});
