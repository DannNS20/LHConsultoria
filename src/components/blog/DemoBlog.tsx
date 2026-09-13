'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Category, Paginated, PostSummary } from '@/lib/types';
import { BLOG_PAGE_SIZE, BlogView, parseCategory } from './BlogView';

/** Listado del blog en el modo demo: los filtros se leen de la URL en el navegador. */
export function DemoBlog() {
  const searchParams = useSearchParams();
  const category = parseCategory(searchParams.get('categoria'));
  const q = (searchParams.get('q') ?? '').trim().slice(0, 100);
  const page = Math.max(1, Math.floor(Number(searchParams.get('pagina'))) || 1);
  const [result, setResult] = useState<{ data: Paginated<PostSummary> | null; categories: Category[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.posts({ category, q, page, limit: BLOG_PAGE_SIZE }), api.categories()])
      .then(([data, categories]) => !cancelled && setResult({ data, categories }))
      .catch(() => !cancelled && setResult({ data: null, categories: [] }));
    return () => {
      cancelled = true;
    };
  }, [category, q, page]);

  return (
    <BlogView
      data={result?.data ?? null}
      categories={result?.categories ?? []}
      category={category}
      q={q}
      page={page}
      loading={!result}
    />
  );
}
