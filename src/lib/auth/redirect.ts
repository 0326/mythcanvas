/** Only allow local application paths for post-auth redirects. */
export function safeRedirect(value: unknown, fallback = '/my/'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback;
  try {
    const url = new URL(value, 'https://mythcanvas.local');
    return url.origin === 'https://mythcanvas.local' ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}
