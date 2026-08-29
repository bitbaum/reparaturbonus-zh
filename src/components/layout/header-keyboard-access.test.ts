/**
 * The Werkstätten megamenu must be reachable without a mouse.
 *
 * It opened on `onMouseEnter` only, so a keyboard user could Tab to the trigger
 * and never see the categories behind it — on a public service where finding a
 * workshop IS the task. The panel is `invisible` when closed, so its links were
 * not in the tab order either: the content simply did not exist for them.
 *
 * WHAT THIS TEST IS. A structural guard, not a behavioural one. This repo's
 * vitest runs in a `node` environment with no DOM and no React testing library,
 * and pulling jsdom + @testing-library in to assert one handler would be a
 * heavier change than the fix. So this asserts the affordances are still wired
 * in the source. It would catch someone deleting `onFocus` or `aria-expanded`;
 * it would not catch them being wired to the wrong state.
 *
 * The behavioural check belongs in the fleet's central rendered UI audit, which
 * drives the real page — see fleet/scripts/ci/ui-defect-audit.mjs.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(__dirname, 'Header.tsx'), 'utf8');

describe('Header — keyboard access to the Werkstätten menu', () => {
  it('opens on focus, not on hover alone', () => {
    expect(source).toContain('onMouseEnter');
    expect(source).toContain('onFocus');
    expect(source).toContain('onBlur');
  });

  it('closes on Escape', () => {
    expect(source).toMatch(/onKeyDown[\s\S]{0,160}Escape/);
  });

  it('announces the popup and its open state', () => {
    expect(source).toContain('aria-haspopup="true"');
    expect(source).toContain('aria-expanded={werkstattenDropdownOpen}');
    expect(source).toContain('aria-controls={WERKSTATTEN_MENU_ID}');
    expect(source).toContain('id={WERKSTATTEN_MENU_ID}');
  });

  it('announces the mobile menu button state', () => {
    expect(source).toContain('aria-expanded={mobileMenuOpen}');
  });

  it('keeps the mobile menu button on the 44px touch floor', () => {
    // w-8 h-8 was 32x32 — under the floor every other repo in the fleet meets.
    expect(source).not.toMatch(/md:hidden[^"]*\bw-8 h-8\b/);
    expect(source).toMatch(/md:hidden[^"]*\bw-11 h-11\b/);
  });

  it('marks the current page for assistive technology', () => {
    expect(source).toContain('aria-current={currentPage(pathname,');
  });
});
