import Link from 'next/link';
import { postHref } from '@/lib/config';
import { categoryNames, formatDate } from '@/lib/site';
import type { PostSummary } from '@/lib/types';
import { PostCover } from './PostCover';

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgb(29_42_36/0.45)]">
      <PostCover
        title={post.title}
        category={post.category}
        coverUrl={post.coverUrl}
        className="aspect-[16/10] transition-transform duration-700"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="rounded-full bg-sage-soft px-2.5 py-1 font-semibold text-forest">
            {categoryNames[post.category]}
          </span>
          <span>{post.readingMinutes} min de lectura</span>
        </div>
        <h3 className="mt-4 font-serif text-2xl leading-tight text-ink">
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-auto pt-6 text-sm text-muted">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-3xl border border-line bg-white">
      <div className="aspect-[16/10] animate-pulse bg-paper-2" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-paper-2" />
        <div className="h-6 w-4/5 animate-pulse rounded-full bg-paper-2" />
        <div className="h-4 w-full animate-pulse rounded-full bg-paper-2" />
      </div>
    </div>
  );
}
