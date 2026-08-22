/**
 * The residence-proof upload is reachable without authentication (a shop
 * redeems a bonus code in person, before the customer necessarily has an
 * account session). That makes the extension used to store it security
 * sensitive: it must come from the SERVER's allowlist keyed on the request's
 * MIME type, never from the client-supplied file name — building a path out
 * of an untrusted file name is a path traversal / arbitrary file write.
 */
const ALLOWED_UPLOAD_EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
}

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export function getAllowedUploadExtension(mimeType: string): string | null {
  return ALLOWED_UPLOAD_EXTENSIONS[mimeType] ?? null
}
