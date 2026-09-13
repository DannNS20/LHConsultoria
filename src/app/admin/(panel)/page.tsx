'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Inbox, NotebookPen, Pencil, Plus, Share2, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShareDialog } from '@/components/blog/ShareDialog';
import { Card, ErrorNotice, PageHeader, StatusBadge, formatDateTime } from '@/components/admin/ui';
import { buttonClass } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { editPostHref } from '@/lib/config';
import { categoryNames } from '@/lib/site';
import type { ContactMessage, PostSummary, Stats } from '@/lib/types';

export default function DashboardPage() {
  const { session, errorMessage } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<PostSummary | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    Promise.all([api.admin.stats(session.token), api.admin.posts(session.token), api.admin.messages(session.token)])
      .then(([s, p, m]) => {
        if (cancelled) return;
        setStats(s);
        setPosts(p.slice(0, 5));
        setMessages(m.slice(0, 3));
      })
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [session, errorMessage]);

  const firstName = session?.user.name.split(' ').slice(0, 2).join(' ');

  return (
    <div>
      <PageHeader
        title={`Hola, ${firstName}`}
        description="Este es el resumen de tu sitio. Desde aquí publicas contenido y revisas los mensajes de tus clientes."
        actions={
          <Link href="/admin/entradas/nueva" className={buttonClass('primary', 'md')}>
            <Plus className="size-4" />
            Nueva entrada
          </Link>
        }
      />

      <div className="mt-6">
        <ErrorNotice message={error} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Entradas publicadas" value={stats?.published} />
        <StatCard icon={NotebookPen} label="Borradores" value={stats?.drafts} />
        <StatCard icon={Inbox} label="Mensajes sin leer" value={stats?.unreadMessages} highlight={!!stats?.unreadMessages} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-semibold">Entradas recientes</h2>
            <Link href="/admin/entradas" className="inline-flex items-center gap-1 text-sm text-forest">
              Ver todas
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {posts === null && <SkeletonRows />}
            {posts?.map((post) => (
              <li key={post.id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <Link href={editPostHref(post.id)} className="block truncate font-medium text-ink hover:text-forest">
                    {post.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <StatusBadge status={post.status} />
                    <span>{categoryNames[post.category]}</span>
                  </div>
                </div>
                {post.status === 'published' && (
                  <button
                    type="button"
                    onClick={() => setSharePost(post)}
                    className={buttonClass('ghost', 'sm')}
                    aria-label={`Compartir ${post.title}`}
                  >
                    <Share2 className="size-4" />
                    <span className="hidden sm:inline">Compartir</span>
                  </button>
                )}
                <Link href={editPostHref(post.id)} className={buttonClass('ghost', 'sm')} aria-label={`Editar ${post.title}`}>
                  <Pencil className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between px-6 pt-6">
            <h2 className="text-lg font-semibold">Últimos mensajes</h2>
            <Link href="/admin/mensajes" className="inline-flex items-center gap-1 text-sm text-forest">
              Ver todos
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {messages === null && <SkeletonRows />}
            {messages?.length === 0 && <li className="px-6 py-8 text-center text-sm text-muted">Aún no hay mensajes.</li>}
            {messages?.map((m) => (
              <li key={m.id} className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {!m.read && <span className="size-2 rounded-full bg-forest" aria-label="Sin leer" />}
                  <p className="font-medium text-ink">{m.name}</p>
                  <p className="ml-auto text-xs text-muted">{formatDateTime(m.createdAt)}</p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{m.message}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 bg-forest text-white">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-mint">
            <Share2 className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Comparte tus entradas en redes</p>
            <p className="mt-1 text-sm text-white/70">
              Al publicar, el sistema genera la imagen promocional con tu logotipo y un texto listo con la liga. Solo
              eliges la red social.
            </p>
          </div>
        </div>
      </Card>

      {sharePost && <ShareDialog key={sharePost.id} post={sharePost} onClose={() => setSharePost(null)} />}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, highlight }: { icon: LucideIcon; label: string; value?: number; highlight?: boolean }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${highlight ? 'bg-forest text-white' : 'bg-sage-soft text-forest'}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-serif text-4xl text-ink tabular-nums">{value ?? '—'}</p>
    </Card>
  );
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <li key={i} className="px-6 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-paper-2" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-paper-2" />
        </li>
      ))}
    </>
  );
}
