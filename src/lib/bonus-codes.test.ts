/**
 * Bonus codes are the money-adjacent part of this product: a code is worth CHF
 * 100 to whoever holds it, and its expiry is a deadline a customer relies on.
 * Until now nothing in the repo executed this file at all — `verify` was lint +
 * typecheck, and there was no test script.
 *
 * These tests lock the behaviour the CODE actually has, not the behaviour the
 * README describes. The two disagree (see the PR): `.claude/CLAUDE.md` says
 * "Amount = 20% of repair cost (max CHF 50)" and "Codes expire after 1 year",
 * while the implementation returns a flat CHF 100 expiring in one month. The
 * implementation is the source of truth for what ships, so it is what is
 * pinned here — and the drift is reported rather than silently "fixed" in
 * either direction, because which one is correct is a product decision.
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  calculateBonusAmount,
  generateBonusCode,
  getBonusExpiryDate,
  isValidBonusCode,
} from './bonus-codes';

afterEach(() => {
  vi.useRealTimers();
});

describe('generateBonusCode', () => {
  it('produces a code that isValidBonusCode accepts', () => {
    // The round trip is the invariant that matters: a generated code the
    // validator rejects would mint bonuses nobody can redeem.
    for (let i = 0; i < 200; i++) {
      expect(isValidBonusCode(generateBonusCode())).toBe(true);
    }
  });

  it('is 8 characters of uppercase letters and digits', () => {
    expect(generateBonusCode()).toMatch(/^[A-Z0-9]{8}$/);
  });

  it('draws from the platform CSPRNG, not Math.random', () => {
    // The point of the change this test guards: a bonus code is a bearer token
    // worth CHF 100, so it must not come from a seeded PRNG whose state is
    // recoverable from prior outputs. Asserting the SOURCE, because the output
    // of a weak generator looks identical to a strong one.
    const getRandomValues = vi.spyOn(globalThis.crypto, 'getRandomValues');
    const mathRandom = vi.spyOn(Math, 'random');

    generateBonusCode();

    expect(getRandomValues).toHaveBeenCalled();
    expect(mathRandom).not.toHaveBeenCalled();

    getRandomValues.mockRestore();
    mathRandom.mockRestore();
  });

  it('redraws instead of folding biased bytes into the alphabet', () => {
    // 256 is not a multiple of 36, so a plain `% 36` would make the first four
    // letters ~14% likelier than the rest. Bytes >= 252 must be discarded.
    // First draw is entirely unusable, second is all zeros -> all 'A'.
    let call = 0;
    const spy = vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(((
      array: Uint8Array,
    ) => {
      array.fill(call === 0 ? 255 : 0);
      call++;
      return array;
    }) as typeof globalThis.crypto.getRandomValues);

    const code = generateBonusCode();

    expect(code).toBe('AAAAAAAA');
    expect(spy).toHaveBeenCalledTimes(2); // the biased draw was thrown away
    spy.mockRestore();
  });

  it('can emit every character in the alphabet', () => {
    // A broken index would silently narrow the keyspace — e.g. only ever
    // reaching the first 26 letters — which weakens the token without
    // changing its shape.
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      for (const ch of generateBonusCode()) seen.add(ch);
    }
    expect(seen.size).toBe(36);
  });

  it('does not return a constant', () => {
    // Cheap guard against the generator being stubbed out or the loop being
    // dropped — 100 draws from a 36^8 space colliding into one value would
    // mean the randomness is gone, not that we got unlucky.
    const seen = new Set(Array.from({ length: 100 }, () => generateBonusCode()));
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('isValidBonusCode', () => {
  it('accepts exactly 8 uppercase alphanumerics', () => {
    expect(isValidBonusCode('ABCD1234')).toBe(true);
    expect(isValidBonusCode('00000000')).toBe(true);
    expect(isValidBonusCode('ZZZZZZZZ')).toBe(true);
  });

  it('rejects the wrong length', () => {
    expect(isValidBonusCode('ABCD123')).toBe(false);
    expect(isValidBonusCode('ABCD12345')).toBe(false);
    expect(isValidBonusCode('')).toBe(false);
  });

  it('rejects lowercase and non-alphanumerics', () => {
    expect(isValidBonusCode('abcd1234')).toBe(false);
    expect(isValidBonusCode('ABCD-234')).toBe(false);
    expect(isValidBonusCode('ABCD 234')).toBe(false);
  });

  it('is anchored, so a valid code embedded in junk is rejected', () => {
    // An unanchored regex here would accept "xxABCD1234xx" and let a padded
    // or whitespace-wrapped value through from a form post.
    expect(isValidBonusCode('xxABCD1234xx')).toBe(false);
    expect(isValidBonusCode('ABCD1234\n')).toBe(false);
  });
});

describe('calculateBonusAmount', () => {
  it('is a flat CHF 100', () => {
    expect(calculateBonusAmount()).toBe(100);
  });
});

describe('getBonusExpiryDate', () => {
  it('is one calendar month after creation', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-15T10:00:00Z'));
    expect(getBonusExpiryDate().toISOString()).toBe('2026-04-15T10:00:00.000Z');
  });

  it('crosses a year boundary correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-10T08:30:00Z'));
    expect(getBonusExpiryDate().toISOString()).toBe('2027-01-10T08:30:00.000Z');
  });

  it('overflows rather than clamping when the target month is shorter', () => {
    // Documented, not endorsed. `setMonth(getMonth() + 1)` on 31 January
    // yields 3 March, not 28 February, because JS rolls the overflow forward.
    // For this product that means a slightly longer bonus, which is why it has
    // never been noticed. Pinned so that changing it is a deliberate decision
    // with a failing test attached, rather than a silent shift in how long
    // customers have to redeem.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-31T12:00:00Z'));
    expect(getBonusExpiryDate().toISOString()).toBe('2026-03-03T12:00:00.000Z');
  });

  it('is always in the future', () => {
    expect(getBonusExpiryDate().getTime()).toBeGreaterThan(Date.now());
  });
});
