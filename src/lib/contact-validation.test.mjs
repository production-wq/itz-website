import assert from 'node:assert/strict';
import test from 'node:test';
import { passesRecaptcha, validateContact } from './contact-validation.ts';

test('accepts international contact names and ordinary business punctuation', () => {
  assert.equal(validateContact({ name: 'Saïkat চৌধুরী', business: "O’Neil & Sons, Inc.", email: 'person@example.com' }), null);
});

test('rejects malformed or oversized fields before sending mail', () => {
  const valid = { name: 'Test Person', business: 'Test Plumbing', email: 'test@example.com' };
  for (const invalid of [{ name: [] }, { business: 'https://spam.example' }, { email: 'invalid' }, { message: 'a'.repeat(5001) }, { pagePath: '//other.example' }]) {
    assert.ok(validateContact({ ...valid, ...invalid }));
  }
});

test('requires a fresh, successful, high-score token for this domain and action', () => {
  const now = Date.now();
  const valid = { success: true, score: 0.9, action: 'contact_submit', hostname: 'itzdigital.co', challenge_ts: new Date(now).toISOString() };
  assert.equal(passesRecaptcha(valid, now), true);
  for (const invalid of [
    { success: false }, { score: 0.49 }, { score: undefined }, { action: 'login' },
    { hostname: 'other.example' }, { challenge_ts: 'invalid' },
    { challenge_ts: new Date(now - 121_000).toISOString() },
    { challenge_ts: new Date(now + 31_000).toISOString() },
  ]) assert.equal(passesRecaptcha({ ...valid, ...invalid }, now), false);
});
