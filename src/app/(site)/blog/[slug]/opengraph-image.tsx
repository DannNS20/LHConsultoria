import { getPostOrNull } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import { DEMO_SEED_SLUGS } from '@/lib/demo-seed';
import { renderShareImage } from '@/lib/share-image';

// En la exportación estática (demo) se generan las imágenes de las entradas de ejemplo.
export async function generateStaticParams() {
  return DEMO_MODE ? DEMO_SEED_SLUGS.map((slug) => ({ slug })) : [];
}

// Imagen que muestran Facebook, WhatsApp, LinkedIn y X al pegar la liga de una entrada.
export const alt = 'Entrada del blog de LH Consultores';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Requerido por la exportación estática del modo demo; en producción la imagen se regenera cada hora como máximo.
export const revalidate = 3600;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostOrNull(slug);
  return renderShareImage(
    post ?? { title: 'Blog de LH Consultores', excerpt: '', category: 'impuestos' },
    'horizontal',
  );
}
