import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostCard, PostCardSkeleton } from '@/components/blog/PostCard';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import type { PostSummary } from '@/lib/types';

interface LatestPostsViewProps {
  /** null mientras se cargan */
  posts: PostSummary[] | null;
  failed?: boolean;
}

export function LatestPostsView({ posts, failed = false }: LatestPostsViewProps) {
  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="container-page">
        <Reveal distance={24}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Blog informativo</Eyebrow>
              <h2 className="max-w-2xl font-serif text-4xl leading-[1.08] text-ink md:text-5xl">
                Información fiscal clara, sin letras chiquitas.
              </h2>
            </div>
            <Link href="/blog" className={buttonClass('secondary', 'md', 'group self-start md:self-auto')}>
              Ver todas las entradas
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {posts === null && !failed ? (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : failed || !posts || posts.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-line p-10 text-center text-muted">
            {failed ? 'No pudimos cargar las entradas en este momento.' : 'Muy pronto publicaremos contenido.'}
          </p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08} className="h-full">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
