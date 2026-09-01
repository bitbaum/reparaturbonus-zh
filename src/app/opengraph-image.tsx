import { ImageResponse } from 'next/og';
import { OG_IMAGE } from '@/lib/constants/site';

/**
 * Social preview card (1200x630 — the 1.91:1 size Slack, Telegram and the
 * OpenGraph scrapers crop to). The site shipped no og:image, so every shared
 * link rendered as a blank grey rectangle.
 *
 * Satori cannot read CSS custom properties, so the palette is repeated here as
 * literals mirroring --primitive-blue-700 / --primitive-copper-500 /
 * --primitive-paper in globals.css, which stays the source of truth.
 */

export const runtime = 'edge';
export const alt = OG_IMAGE.alt;
export const size = { width: OG_IMAGE.width, height: OG_IMAGE.height };
export const contentType = 'image/png';

const BLUE = '#1B4A8F';
const BLUE_DEEP = '#0F2E5C';
const COPPER = '#C26B2D';
const PAPER = '#F7F5F1';
const STONE = '#6E665C';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{ width: 18, height: 18, borderRadius: 4, background: COPPER, display: 'flex' }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: BLUE,
            fontWeight: 600,
          }}
        >
          Reparaturbonus Zürich
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.04,
            color: BLUE_DEEP,
            maxWidth: 960,
          }}
        >
          Reparieren statt wegwerfen
        </div>
        <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35, color: STONE, maxWidth: 900 }}>
          Die beste Werkstatt in Zürich finden und CHF 100 Reparaturbonus der Stadt nutzen.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{ width: 64, height: 5, borderRadius: 999, background: COPPER, display: 'flex' }}
        />
        <div style={{ fontSize: 24, color: STONE }}>reparaturbonus.orangecat.ch</div>
      </div>
    </div>,
    { ...size },
  );
}
