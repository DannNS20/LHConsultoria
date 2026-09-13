'use client';

import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PostEditor } from '@/components/admin/PostEditor';
import { buttonClass } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Post } from '@/lib/types';

export function EditPost({ id }: { id: string }) {
  const { session, errorMessage } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api.admin
      .post(session.token, id)
      .then((result) => !cancelled && setPost(result))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [session, id, errorMessage]);

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center">
        <p className="font-serif text-2xl">No pudimos abrir esta entrada</p>
        <p className="mt-2 text-muted">{error}</p>
        <Link href="/admin/entradas" className={buttonClass('secondary', 'md', 'mt-6')}>
          Volver a entradas
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <LoaderCircle className="size-6 animate-spin text-forest" aria-label="Cargando entrada" />
      </div>
    );
  }

  return <PostEditor initial={post} />;
}
