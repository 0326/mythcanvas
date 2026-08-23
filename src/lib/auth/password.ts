const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PBKDF2_ITERATIONS = 120_000;
const HASH_LENGTH_BITS = 256;

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return `密码至少需要 ${PASSWORD_MIN_LENGTH} 位。`;
  if (password.length > PASSWORD_MAX_LENGTH) return `密码不能超过 ${PASSWORD_MAX_LENGTH} 位。`;
  return null;
}

/** Hash passwords with a per-account random salt using Workers-supported Web Crypto PBKDF2. */
export async function hashPassword(password: string): Promise<string> {
  const saltBuffer = new ArrayBuffer(16);
  const salt = crypto.getRandomValues(new Uint8Array(saltBuffer));
  const derived = await derive(password, saltBuffer, PBKDF2_ITERATIONS);
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(derived))}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') return false;

  const iterations = Number(parts[1]);
  const salt = fromBase64Url(parts[2]);
  const expected = fromBase64Url(parts[3]);
  if (!Number.isSafeInteger(iterations) || iterations < 100_000 || !salt || !expected) return false;

  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const expectedBuffer = new ArrayBuffer(expected.byteLength);
  new Uint8Array(expectedBuffer).set(expected);
  const actual = new Uint8Array(await derive(password, saltBuffer, iterations));
  return safeEqual(actual, new Uint8Array(expectedBuffer));
}

async function derive(password: string, salt: ArrayBuffer, iterations: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    HASH_LENGTH_BITS,
  );
}

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index];
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}
