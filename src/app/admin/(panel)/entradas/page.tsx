'use client';

import Link from 'next/link';
import { Eye, LoaderCircle, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ErrorNotice, PageHeader, StatusBadge } from '@/components/admin/ui';
import { PostCover } from '@/components/blog/PostCover';
import { ShareDialog } from '@/components/blog/ShareDialog';
import { buttonClass } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { editPostHref, postHref } from '@/lib/config';
import { categoryNames, formatDate } from '@/lib/site';
import type { PostSummary } from '@/lib/types';

type Filter = 'all' | 'published' | 'draft';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'published', label: 'Publicadas' },
  { id: 'draft', label: 'Borradores' },
];

export default function PostsPage() {
  const { session, errorMessage } = useAuth();
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<PostSummary | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api.admin
      .posts(session.token)
      .then((result) => !cancelled && setPosts(result))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [session, errorMessage]);

  async function remove(post: PostSummary) {
    if (!session || !window.confirm(`¿Eliminar “${post.title}”? Esta acción no se puede deshacer.`)) return;
    setDeleting(post.id);
    setError(null);
    try {
      await api.admin.deletePost(session.token, post.id);
      setPosts((current) => current?.filter((p) => p.id !== post.id) ?? null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeleting(null);
    }
  }

  const count = (f: Filter) => posts?.filter((p) => f === 'all' || p.status === f).length ?? 0;
  const visible = posts?.filter((p) => filter === 'all' || p.status === filter) ?? [];

  return (
    <div>
      <PageHeader
        title="Entradas"
        description="Administra las publicaciones del blog."
        actions={
          <Link href="/admin/entradas/nueva" className={buttonClass('primary', 'md')}>
            <Plus className="size-4" />
            Nueva entrada
          </Link>
        }
      />

      <div className="mt-8 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filter === f.id ? 'bg-forest text-white' : 'border border-line bg-white text-ink-2 hover:border-forest/40'
            }`}
          >
            {f.label} <span className={filter === f.id ? 'text-mint' : 'text-muted'}>{count(f.id)}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <ErrorNotice message={error} />
      </div>

      <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {posts === null && !error && (
          <li className="grid place-items-center py-16">
            <LoaderCircle className="size-6 animate-spin text-forest" aria-label="Cargando entradas" />
          </li>
        )}
        {posts !== null && visible.length === 0 && (
          <li className="px-6 py-16 text-center text-muted">No hay entradas en esta vista.</li>
        )}
        {visible.map((post) => (
          <li key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
            <PostCover
              title={post.title}
              category={post.category}
              coverUrl={post.coverUrl}
              sizes="96px"
              className="hidden aspect-[4/3] w-24 shrink-0 rounded-xl sm:block"
            />
            <div className="min-w-0 flex-1">
              <Link href={editPostHref(post.id)} className="font-medium text-ink hover:text-forest">
                {post.title}
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
                <StatusBadge status={post.status} />
                <span>{categoryNames[post.category]}</span>
                <span>Actualizada el {formatDate(post.updatedAt)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.status === 'published' && (
                <>
                  <Link
                    href={postHref(post.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('ghost', 'sm')}
                    aria-label={`Ver ${post.title}`}
                  >
                    <Eye className="size-4" />
                  </Link>
                  <button type="button" onClick={() => setSharePost(post)} className={buttonClass('ghost', 'sm')}>
                    <Share2 className="size-4" />
                    Compartir
                  </button>
                </>
              )}
              <Link href={editPostHref(post.id)} className={buttonClass('ghost', 'sm')}>
                <Pencil className="size-4" />
                Editar
              </Link>
              <button
                type="button"
                onClick={() => remove(post)}
                disabled={deleting === post.id}
                aria-label={`Eliminar ${post.title}`}
                className={buttonClass('ghost', 'sm', 'hover:bg-red-50 hover:text-red-700')}
              >
                {deleting === post.id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {sharePost && <ShareDialog key={sharePost.id} post={sharePost} onClose={() => setSharePost(null)} />}
    </div>
  );
}
