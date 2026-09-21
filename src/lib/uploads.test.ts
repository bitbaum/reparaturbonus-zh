import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import {
  ALLOWED_UPLOAD_LABEL,
  ALLOWED_UPLOAD_MIME_TYPES,
  getAllowedUploadExtension,
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
} from './uploads';

describe('getAllowedUploadExtension', () => {
  it('maps allowed MIME types to a fixed, safe extension', () => {
    expect(getAllowedUploadExtension('application/pdf')).toBe('.pdf');
    expect(getAllowedUploadExtension('image/jpeg')).toBe('.jpg');
    expect(getAllowedUploadExtension('image/png')).toBe('.png');
  });

  it('rejects anything not on the allowlist', () => {
    expect(getAllowedUploadExtension('text/html')).toBeNull();
    expect(getAllowedUploadExtension('application/x-msdownload')).toBeNull();
    expect(getAllowedUploadExtension('image/svg+xml')).toBeNull();
    expect(getAllowedUploadExtension('')).toBeNull();
  });

  it('never returns a value an attacker could turn into a path traversal', () => {
    // The whole point of this function: its return value is joined straight
    // into a filesystem path, so it must never contain a separator or "..".
    const extensions = [
      getAllowedUploadExtension('application/pdf'),
      getAllowedUploadExtension('image/jpeg'),
      getAllowedUploadExtension('image/png'),
    ];
    for (const ext of extensions) {
      expect(ext).not.toMatch(/[\\/]/);
      expect(ext).not.toContain('..');
    }
  });
});

describe('MAX_UPLOAD_SIZE_BYTES', () => {
  it('is a sane, non-zero limit', () => {
    expect(MAX_UPLOAD_SIZE_BYTES).toBeGreaterThan(0);
  });

  it('is the megabyte figure shown to users, in bytes', () => {
    expect(MAX_UPLOAD_SIZE_BYTES).toBe(MAX_UPLOAD_SIZE_MB * 1024 * 1024);
  });
});

describe('the allowlist the UI advertises', () => {
  it('offers the file picker exactly the MIME types the server accepts', () => {
    for (const mimeType of ALLOWED_UPLOAD_MIME_TYPES) {
      expect(getAllowedUploadExtension(mimeType)).not.toBeNull();
    }
    expect(ALLOWED_UPLOAD_MIME_TYPES).toHaveLength(3);
  });

  it('spells the same allowlist for a human', () => {
    expect(ALLOWED_UPLOAD_LABEL).toBe('PDF, JPG, PNG');
  });
});

describe('the /verify upload hint', () => {
  // Shops were told "MAX. 5MB" for as long as the limit was typed into the page
  // instead of read from here. Either the page derives it, or it drifts again.
  const page = readFileSync(join(process.cwd(), 'src/app/verify/page.tsx'), 'utf8');

  it('names no size of its own', () => {
    // Case-sensitive on purpose: a displayed size reads "10MB", while Tailwind's
    // lowercase `mb-2` margins would otherwise match every line of the page.
    expect(page).not.toMatch(/\d+\s*MB/);
  });

  it('reads the limit and the formats from this module', () => {
    expect(page).toContain("from '@/lib/uploads'");
    expect(page).toContain('MAX_UPLOAD_SIZE_MB');
    expect(page).toContain('ALLOWED_UPLOAD_LABEL');
  });
});
