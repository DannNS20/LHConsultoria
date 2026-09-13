'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buttonClass } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { Post, PostSummary } from '@/lib/types';
import { PostView } from './PostView';

type State = { kind: 'loading' } | { kind: 'missing' } | { kind: 'ready'; post: Post; related: PostSummary[] };

/** Entrada del blog en el modo demo: se lee en el navegador a partir de ?slug=. */
export function DemoPost() {
  const slug = useSearchParams().get('slug') ?? '';
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    api
      .post(slug)
      .then(async (post) => {
        const related = await api.posts({ category: post.category, exclude: post.slug, limit: 3 });
        if (cancelled) return;
        document.title = `${post.title} · LH Consultores`;
        setState({ kind: 'ready', post, related: related.items });
      })
      .catch(() => !cancelled && setState({ kind: 'missing' }));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.kind === 'loading') return <DemoPostLoading />;

  if (state.kind === 'missing') {
    return (
      <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-forest uppercase">Error 404</p>
        <h1 className="mt-4 font-serif text-5xl">No encontramos esta entrada</h1>
        <p className="mt-4 max-w-md text-lg text-muted">Es posible que se haya retirado o que la liga tenga un error.</p>
        <Link href="/blog" className={buttonClass('primary', 'lg', 'mt-10')}>
          Ver el blog
        </Link>
      </section>
    );
  }

  return <PostView post={state.post} related={state.related} />;
}

export function DemoPostLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center pt-32">
      <LoaderCircle className="size-6 animate-spin text-forest" aria-label="Cargando entrada" />
    </div>
  );
}
