import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BLOG_PAGE_SIZE, BlogView, parseCategory } from '@/components/blog/BlogView';
import { DemoBlog } from '@/components/blog/DemoBlog';
import { api } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import type { Category, Paginated, PostSummary } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artículos, videos e infografías sobre impuestos, SAT, nómina y finanzas, explicados en lenguaje claro por LH Consultores.',
};

export default async function BlogPage({ searchParams }: PageProps<'/blog'>) {
  if (DEMO_MODE) {
    return (
      <Suspense fallback={<BlogView data={null} categories={[]} q="" page={1} loading />}>
        <DemoBlog />
      </Suspense>
    );
  }

  const sp = await searchParams;
  const category = parseCategory(sp.categoria);
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 100) : '';
  const page = Math.max(1, Math.floor(Number(sp.pagina)) || 1);

  let data: Paginated<PostSummary> | null = null;
  let categories: Category[] = [];
  try {
    [data, categories] = await Promise.all([api.posts({ category, q, page, limit: BLOG_PAGE_SIZE }), api.categories()]);
  } catch {
    data = null;
  }

  return <BlogView data={data} categories={categories} category={category} q={q} page={page} />;
}
