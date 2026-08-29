import { describe, expect, it } from 'vitest';
import { getAllowedUploadExtension, MAX_UPLOAD_SIZE_BYTES } from './uploads';

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
});
