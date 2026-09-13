import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_URL, categoryNames } from './site';
import type { PostSummary } from './types';

// Plantilla promocional que se genera automáticamente para cada entrada del blog.

export const SHARE_FORMATS = {
  horizontal: { width: 1200, height: 630, label: 'Horizontal', hint: 'Facebook, LinkedIn y X' },
  cuadrado: { width: 1080, height: 1080, label: 'Cuadrada', hint: 'Instagram y WhatsApp' },
  historia: { width: 1080, height: 1920, label: 'Historia', hint: 'Historias de Instagram y TikTok' },
} as const;

export type ShareFormat = keyof typeof SHARE_FORMATS;

export function isShareFormat(value: string | null): value is ShareFormat {
  return value !== null && value in SHARE_FORMATS;
}

const fontsDir = join(process.cwd(), 'src/assets/fonts');
const [interRegular, interBold, newsreaderSemibold] = await Promise.all([
  readFile(join(fontsDir, 'inter-latin-400-normal.woff')),
  readFile(join(fontsDir, 'inter-latin-700-normal.woff')),
  readFile(join(fontsDir, 'newsreader-latin-600-normal.woff')),
]);

// Pendiente: el logo oficial es un GIF animado y la imagen para redes es estática.
// Mientras el despacho entrega una versión fija del logo, se muestra el nombre en texto.

const TITLE_SIZES: Record<ShareFormat, [number, number, number]> = {
  horizontal: [66, 58, 50],
  cuadrado: [86, 74, 62],
  historia: [104, 92, 80],
};

function titleSize(title: string, format: ShareFormat): number {
  const [short, medium, long] = TITLE_SIZES[format];
  return title.length < 45 ? short : title.length < 75 ? medium : long;
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

type SharePost = Pick<PostSummary, 'title' | 'excerpt' | 'category'>;

export function renderShareImage(post: SharePost, format: ShareFormat, headers?: Record<string, string>) {
  const { width, height } = SHARE_FORMATS[format];
  const horizontal = format === 'horizontal';
  const scale = horizontal ? 1 : 1.3;
  const pad = horizontal ? 72 : 96;
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          padding: pad,
          background: '#2F4239',
          color: '#FFFFFF',
          fontFamily: 'Inter',
        }}
      >
        {/* Línea de balance con punto, tomada del logotipo */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: horizontal ? 250 : height * 0.36,
            width: horizontal ? 360 : 520,
            height: 4,
            background: 'rgba(255,255,255,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: horizontal ? 120 : 170,
            top: horizontal ? 150 : height * 0.36 - 150,
            width: horizontal ? 64 : 92,
            height: horizontal ? 64 : 92,
            borderRadius: 999,
            background: 'rgba(201,214,205,0.18)',
          }}
        />

        <div style={{ display: 'flex', fontSize: 34 * scale, fontWeight: 700, letterSpacing: 1 }}>LH Consultores</div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                padding: `${10 * scale}px ${22 * scale}px`,
                borderRadius: 999,
                background: '#C9D6CD',
                color: '#1D2A24',
                fontSize: 22 * scale,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {categoryNames[post.category]}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 30 * scale,
              maxWidth: horizontal ? 960 : 900,
              fontFamily: 'Newsreader',
              fontWeight: 600,
              fontSize: titleSize(post.title, format),
              lineHeight: 1.12,
              letterSpacing: -1,
            }}
          >
            {post.title}
          </div>
          {!horizontal && post.excerpt && (
            <div
              style={{
                display: 'flex',
                marginTop: 36,
                maxWidth: 860,
                fontSize: format === 'historia' ? 40 : 34,
                lineHeight: 1.45,
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              {truncate(post.excerpt, format === 'historia' ? 190 : 150)}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 30 * scale,
            borderTop: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 20 * scale,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#C9D6CD',
                fontWeight: 700,
              }}
            >
              Lee el artículo completo
            </div>
            <div style={{ display: 'flex', marginTop: 8, fontSize: 32 * scale, fontWeight: 700 }}>{`${host}/blog`}</div>
          </div>
          {horizontal && (
            <div
              style={{
                display: 'flex',
                fontFamily: 'Newsreader',
                fontSize: 30,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Nuestro balance, tu tranquilidad.
            </div>
          )}
        </div>
      </div>
    ),
    {
      width,
      height,
      headers,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
        { name: 'Newsreader', data: newsreaderSemibold, weight: 600, style: 'normal' },
      ],
    },
  );
}
