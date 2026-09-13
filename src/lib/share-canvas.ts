import { SITE_URL, categoryNames } from './site';
import type { CategorySlug } from './types';

// Versión en el navegador (canvas) de la plantilla promocional de lib/share-image.tsx.
// Se usa en el modo demo, donde no hay servidor que genere la imagen.

export type ShareFormat = 'horizontal' | 'cuadrado' | 'historia';

const SIZES: Record<ShareFormat, [number, number]> = {
  horizontal: [1200, 630],
  cuadrado: [1080, 1080],
  historia: [1080, 1920],
};

const TITLE_SIZES: Record<ShareFormat, [number, number, number]> = {
  horizontal: [66, 58, 50],
  cuadrado: [86, 74, 62],
  historia: [104, 92, 80],
};

interface ShareCanvasPost {
  title: string;
  excerpt: string;
  category: CategorySlug;
}

function fontFamily(variable: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderShareBlob(post: ShareCanvasPost, format: ShareFormat): Promise<Blob> {
  await document.fonts.ready;
  const [w, h] = SIZES[format];
  const horizontal = format === 'horizontal';
  const scale = horizontal ? 1 : 1.3;
  const pad = horizontal ? 72 : 96;
  const serif = fontFamily('--font-newsreader', 'Georgia, serif');
  const sans = fontFamily('--font-inter', 'Arial, sans-serif');

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('El navegador no permite generar la imagen.');
  ctx.textBaseline = 'top';

  // Fondo y línea de balance
  ctx.fillStyle = '#2F4239';
  ctx.fillRect(0, 0, w, h);
  const lineY = horizontal ? 250 : h * 0.36;
  const lineW = horizontal ? 360 : 520;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(w - lineW, lineY, lineW, 4);
  const radius = horizontal ? 32 : 46;
  ctx.fillStyle = 'rgba(201,214,205,0.18)';
  ctx.beginPath();
  ctx.arc(w - (horizontal ? 120 : 170) - radius, (horizontal ? 150 : lineY - 150) + radius, radius, 0, Math.PI * 2);
  ctx.fill();

  // Marca
  const brandSize = 34 * scale;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${brandSize}px ${sans}`;
  ctx.fillText('LH Consultores', pad, pad);
  const brandBottom = pad + brandSize * 1.2;

  // Pie con la liga
  const labelSize = 20 * scale;
  const hostSize = (horizontal ? 28 : 32) * scale;
  const footerTop = h - pad - hostSize * 1.2 - 8 - labelSize * 1.2;
  const dividerY = footerTop - 30 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(pad, dividerY, w - pad * 2, 2);

  ctx.fillStyle = '#C9D6CD';
  ctx.font = `700 ${labelSize}px ${sans}`;
  ctx.letterSpacing = '3px';
  ctx.fillText('LEE EL ARTÍCULO COMPLETO', pad, footerTop);
  ctx.letterSpacing = '0px';

  const site = new URL(SITE_URL);
  const host = `${site.host}${site.pathname.replace(/\/$/, '')}/blog`;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${hostSize}px ${sans}`;
  const hostWidth = ctx.measureText(host).width;
  ctx.fillText(host, pad, footerTop + labelSize * 1.2 + 8);

  if (horizontal) {
    ctx.font = `400 30px ${serif}`;
    const tagline = 'Nuestro balance, tu tranquilidad.';
    if (pad * 2 + hostWidth + ctx.measureText(tagline).width + 40 < w) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'right';
      ctx.fillText(tagline, w - pad, footerTop + 12);
      ctx.textAlign = 'left';
    }
  }

  // Bloque central: categoría, título y resumen
  const pillFont = 22 * scale;
  const pillPadX = 22 * scale;
  const pillPadY = 10 * scale;
  const pillText = categoryNames[post.category].toUpperCase();
  ctx.font = `700 ${pillFont}px ${sans}`;
  ctx.letterSpacing = '2px';
  const pillW = ctx.measureText(pillText).width + pillPadX * 2;
  ctx.letterSpacing = '0px';
  const pillH = pillFont * 1.2 + pillPadY * 2;

  const [short, medium, long] = TITLE_SIZES[format];
  const titleSize = post.title.length < 45 ? short : post.title.length < 75 ? medium : long;
  ctx.font = `600 ${titleSize}px ${serif}`;
  const titleLines = wrap(ctx, post.title, horizontal ? 960 : 900);
  const titleLineHeight = titleSize * 1.12;

  const excerptSize = format === 'historia' ? 40 : 34;
  const excerptLineHeight = excerptSize * 1.45;
  let excerptLines: string[] = [];
  if (!horizontal && post.excerpt) {
    const max = format === 'historia' ? 190 : 150;
    const text = post.excerpt.length <= max ? post.excerpt : `${post.excerpt.slice(0, max).replace(/\s+\S*$/, '')}…`;
    ctx.font = `400 ${excerptSize}px ${sans}`;
    excerptLines = wrap(ctx, text, 860);
  }

  const blockHeight =
    pillH +
    30 * scale +
    titleLines.length * titleLineHeight +
    (excerptLines.length ? 36 + excerptLines.length * excerptLineHeight : 0);
  let y = brandBottom + Math.max(24, (dividerY - brandBottom - blockHeight) / 2);

  ctx.fillStyle = '#C9D6CD';
  ctx.beginPath();
  ctx.roundRect(pad, y, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = '#1D2A24';
  ctx.font = `700 ${pillFont}px ${sans}`;
  ctx.letterSpacing = '2px';
  ctx.fillText(pillText, pad + pillPadX, y + pillPadY);
  ctx.letterSpacing = '0px';
  y += pillH + 30 * scale;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${titleSize}px ${serif}`;
  for (const line of titleLines) {
    ctx.fillText(line, pad, y);
    y += titleLineHeight;
  }

  if (excerptLines.length) {
    y += 36;
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = `400 ${excerptSize}px ${sans}`;
    for (const line of excerptLines) {
      ctx.fillText(line, pad, y);
      y += excerptLineHeight;
    }
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen.'))), 'image/png'),
  );
}
