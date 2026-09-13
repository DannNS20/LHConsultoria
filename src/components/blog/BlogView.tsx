import Form from 'next/form';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { PostCard, PostCardSkeleton } from '@/components/blog/PostCard';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { categoryNames } from '@/lib/site';
import type { Category, CategorySlug, Paginated, PostSummary } from '@/lib/types';

export const BLOG_PAGE_SIZE = 9;

export function parseCategory(value: unknown): CategorySlug | undefined {
  return typeof value === 'string' && value in categoryNames ? (value as CategorySlug) : undefined;
}

function blogHref(params: { categoria?: string; q?: string; pagina?: number }): string {
  const search = new URLSearchParams();
  if (params.categoria) search.set('categoria', params.categoria);
  if (params.q) search.set('q', params.q);
  if (params.pagina && params.pagina > 1) search.set('pagina', String(params.pagina));
  const s = search.toString();
  return s ? `/blog?${s}` : '/blog';
}

interface BlogViewProps {
  data: Paginated<PostSummary> | null;
  categories: Category[];
  category?: CategorySlug;
  q: string;
  page: number;
  loading?: boolean;
}

/** Vista del listado del blog; la usan la página del servidor y la versión del modo demo. */
export function BlogView({ data, categories, category, q, page, loading = false }: BlogViewProps) {
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const totalPublished = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-14 md:pt-44 md:pb-20">
        <div
          aria-hidden="true"
          className="ledger-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_20%,transparent)]"
        />
        <div className="container-page relative">
          <Eyebrow>Blog informativo</Eyebrow>
          <h1 className="max-w-3xl font-serif text-5xl leading-[1.04] text-ink md:text-6xl">
            Información fiscal clara para personas y negocios.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            Artículos, videos e infografías para entender tus obligaciones ante el SAT y tomar mejores decisiones con tu
            dinero.
          </p>

          <Form
            key={`${category ?? ''}-${q}`}
            action="/blog"
            className="mt-9 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 shadow-sm focus-within:border-forest/40"
          >
            {category && <input type="hidden" name="categoria" value={category} />}
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">
              Buscar en el blog
            </label>
            <input
              id="blog-search"
              name="q"
              defaultValue={q}
              placeholder="Busca un tema: declaración anual, nómina…"
              className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted/70"
            />
            <button type="submit" className={buttonClass('primary', 'sm', 'h-10')}>
              Buscar
            </button>
          </Form>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-page">
          <nav aria-label="Categorías" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            <CategoryChip href={blogHref({ q })} active={!category} label="Todas" count={totalPublished} />
            {categories.map((c) => (
              <CategoryChip
                key={c.slug}
                href={blogHref({ categoria: c.slug, q })}
                active={category === c.slug}
                label={c.name}
                count={c.count}
              />
            ))}
          </nav>

          {q && (
            <p className="mt-6 text-sm text-muted">
              Resultados para <span className="font-medium text-ink">“{q}”</span> ·{' '}
              <Link href={blogHref({ categoria: category })} className="text-forest underline underline-offset-4">
                Limpiar búsqueda
              </Link>
            </p>
          )}

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : !data ? (
            <p className="mt-10 rounded-3xl border border-dashed border-line p-12 text-center text-muted">
              No pudimos cargar las entradas en este momento. Intenta de nuevo en unos minutos.
            </p>
          ) : data.items.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-line p-12 text-center">
              <p className="font-serif text-2xl">No encontramos entradas</p>
              <p className="mt-2 text-muted">Prueba con otra palabra o revisa otra categoría.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {data && totalPages > 1 && (
            <nav aria-label="Paginación" className="mt-12 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={blogHref({ categoria: category, q, pagina: page - 1 })} className={buttonClass('secondary', 'md')}>
                  <ChevronLeft className="size-4" />
                  Anterior
                </Link>
              )}
              <span className="text-sm text-muted">
                Página {page} de {totalPages}
              </span>
              {page < totalPages && (
                <Link href={blogHref({ categoria: category, q, pagina: page + 1 })} className={buttonClass('secondary', 'md')}>
                  Siguiente
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
        active ? 'border-forest bg-forest text-white' : 'border-line bg-white text-ink-2 hover:border-forest/40'
      }`}
    >
      {label}
      <span className={`text-xs ${active ? 'text-mint' : 'text-muted'}`}>{count}</span>
    </Link>
  );
}
