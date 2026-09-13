import { getPostOrNull } from '@/lib/api';
import { isShareFormat, renderShareImage } from '@/lib/share-image';

// Imagen promocional de una entrada: /blog/[slug]/imagen?formato=cuadrado&descargar
// Extensión .dyn.tsx: necesita servidor, así que se excluye del build estático del modo demo (ver next.config.ts).
export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const post = await getPostOrNull(slug);
  if (!post) return new Response('Entrada no encontrada', { status: 404 });

  const search = new URL(request.url).searchParams;
  const requested = search.get('formato');
  const format = isShareFormat(requested) ? requested : 'cuadrado';

  return renderShareImage(post, format, {
    'Cache-Control': 'no-store',
    ...(search.has('descargar') && {
      'Content-Disposition': `attachment; filename="lh-consultores-${slug}-${format}.png"`,
    }),
  });
}
