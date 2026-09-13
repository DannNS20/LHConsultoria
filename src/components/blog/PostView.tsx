import Link from 'next/link';
import { BlockRenderer } from '@/components/blog/BlockRenderer';
import { PostCard } from '@/components/blog/PostCard';
import { PostCover } from '@/components/blog/PostCover';
import { ShareButton } from '@/components/blog/ShareButton';
import { buttonClass } from '@/components/ui/button';
import { categoryNames, formatDate } from '@/lib/site';
import type { Post, PostSummary } from '@/lib/types';

/** Vista de una entrada del blog; la usan la página del servidor y la versión del modo demo. */
export function PostView({ post, related }: { post: Post; related: PostSummary[] }) {
  const share = { slug: post.slug, title: post.title, excerpt: post.excerpt, category: post.category };

  return (
    <article>
      <header className="pt-32 md:pt-40">
        <div className="container-page max-w-4xl">
          <nav aria-label="Ruta" className="flex items-center gap-2 text-sm text-muted">
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/blog?categoria=${post.category}`} className="font-medium text-forest">
              {categoryNames[post.category]}
            </Link>
          </nav>

          <h1 className="mt-6 font-serif text-4xl leading-[1.06] text-ink md:text-6xl">{post.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-2">{post.excerpt}</p>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-forest text-sm font-bold tracking-tight text-white">
                LH
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{post.author}</p>
                <p className="text-sm text-muted">
                  {formatDate(post.publishedAt)} · {post.readingMinutes} min de lectura
                </p>
              </div>
            </div>
            <ShareButton post={share} />
          </div>
        </div>

        <div className="container-page mt-10 max-w-5xl">
          <PostCover
            title={post.title}
            category={post.category}
            coverUrl={post.coverUrl}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="aspect-[16/7] rounded-3xl"
          />
        </div>
      </header>

      <div className="container-page max-w-3xl py-14 md:py-20">
        <BlockRenderer blocks={post.blocks} />

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="font-serif text-2xl">¿Te fue útil? Compártelo.</p>
          <ShareButton post={share} variant="primary" label="Compartir entrada" />
        </div>

        <aside className="relative mt-12 overflow-hidden rounded-3xl bg-forest p-8 text-white md:p-10">
          <div aria-hidden="true" className="ledger-lines-light absolute inset-0" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-serif text-3xl">¿Tienes dudas sobre este tema?</p>
              <p className="mt-2 text-white/70">Revisamos tu caso y te explicamos qué te conviene hacer.</p>
            </div>
            <Link href="/#contacto" className={buttonClass('light', 'lg')}>
              Agenda una asesoría
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2/60 py-20">
          <div className="container-page">
            <h2 className="font-serif text-3xl md:text-4xl">Sigue leyendo</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
