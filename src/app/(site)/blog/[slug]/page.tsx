import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { PostView } from '@/components/blog/PostView';
import { api, getPostOrNull } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import { DEMO_SEED_SLUGS } from '@/lib/demo-seed';
import type { PostSummary } from '@/lib/types';

const getPost = cache(getPostOrNull);

// En la exportación estática (demo) se generan las entradas de ejemplo; en producción se renderizan al pedirlas.
export async function generateStaticParams() {
  return DEMO_MODE ? DEMO_SEED_SLUGS.map((slug) => ({ slug })) : [];
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Entrada no encontrada' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related: PostSummary[] = await api
    .posts({ category: post.category, exclude: post.slug, limit: 3 })
    .then((r) => r.items)
    .catch(() => []);

  return <PostView post={post} related={related} />;
}
