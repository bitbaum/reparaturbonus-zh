const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 8;

/**
 * A bonus code is a bearer token: whoever presents it gets CHF 100. It is
 * therefore generated from a cryptographic source, not `Math.random()`.
 *
 * `Math.random()` is seeded PRNG output with no unpredictability guarantee —
 * given enough observed codes its internal state is recoverable, and the next
 * one becomes predictable. For a value redeemable for money that is the
 * difference between "hard to guess" and "guessable by someone who bothers".
 *
 * Web Crypto rather than `node:crypto` deliberately: `globalThis.crypto` exists
 * in Node 18+, in the edge runtime and in the browser, so this module cannot
 * break a build by being imported somewhere new. (Today it is only reached from
 * the API route, but that is a fact about callers, not a property of the file.)
 *
 * Rejection sampling, not `% 36`: 256 is not a multiple of 36, so plain modulo
 * would make the first 4 letters of the alphabet ~14% likelier than the rest.
 * Bytes at or above the largest usable multiple are discarded and redrawn.
 */
export function generateBonusCode(): string {
  const limit = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length; // 252
  let result = '';

  while (result.length < CODE_LENGTH) {
    const bytes = new Uint8Array(CODE_LENGTH);
    globalThis.crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte >= limit) continue; // would bias the distribution — redraw
      result += CODE_ALPHABET.charAt(byte % CODE_ALPHABET.length);
      if (result.length === CODE_LENGTH) break;
    }
  }

  return result;
}

export function calculateBonusAmount(): number {
  // Fixed bonus amount: CHF 100 reserved for one month
  return 100;
}

export function getBonusExpiryDate(): Date {
  // Bonus codes expire 1 month from creation
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  return expiryDate;
}

export function isValidBonusCode(code: string): boolean {
  // Basic validation: 8 characters, alphanumeric
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
}
