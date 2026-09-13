// Modo demo: build estático para GitHub Pages, sin backend (los datos viven en el navegador).
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === '1';

// Prefijo de la app cuando se publica en un subdirectorio (p. ej. /LHConsultoria en GitHub Pages).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Ruta a un archivo de /public con el basePath (para <img> y elementos que no son de Next). */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** Liga interna a una entrada (sin basePath: <Link> lo agrega). En la demo la entrada se lee en el navegador. */
export function postHref(slug: string): string {
  return DEMO_MODE ? `/blog/ver/?slug=${encodeURIComponent(slug)}` : `/blog/${slug}`;
}

/** Liga interna al editor de una entrada. */
export function editPostHref(id: string): string {
  return `/admin/entradas/editar/?id=${encodeURIComponent(id)}`;
}
