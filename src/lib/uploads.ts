/**
 * The residence-proof upload is reachable without authentication (a shop
 * redeems a bonus code in person, before the customer necessarily has an
 * account session). That makes the extension used to store it security
 * sensitive: it must come from the SERVER's allowlist keyed on the request's
 * MIME type, never from the client-supplied file name — building a path out
 * of an untrusted file name is a path traversal / arbitrary file write.
 *
 * Everything the upload contract consists of — which types are accepted, how
 * large a file may be, and how both are spelled for a human — is derived from
 * this module. The picker on /verify told shops "MAX. 5MB" while the server
 * accepted 10 MB, because that number was typed a second time in the UI.
 */
const ALLOWED_UPLOAD_EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

const BYTES_PER_MEGABYTE = 1024 * 1024;

export const MAX_UPLOAD_SIZE_MB = 10;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * BYTES_PER_MEGABYTE;

/** The `accept` attribute for a file input: exactly what the server enforces. */
export const ALLOWED_UPLOAD_MIME_TYPES = Object.keys(ALLOWED_UPLOAD_EXTENSIONS);

/** The same allowlist spelled for a human: "PDF, JPG, PNG". */
export const ALLOWED_UPLOAD_LABEL = Object.values(ALLOWED_UPLOAD_EXTENSIONS)
  .map((extension) => extension.replace('.', '').toUpperCase())
  .join(', ');

export function getAllowedUploadExtension(mimeType: string): string | null {
  return ALLOWED_UPLOAD_EXTENSIONS[mimeType] ?? null;
}
