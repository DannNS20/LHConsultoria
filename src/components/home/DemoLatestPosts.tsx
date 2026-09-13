'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { PostSummary } from '@/lib/types';
import { LatestPostsView } from './LatestPostsView';

/** Últimas entradas en el modo demo (datos del navegador). */
export function DemoLatestPosts() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .posts({ limit: 3 })
      .then((r) => !cancelled && setPosts(r.items))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return <LatestPostsView posts={posts} failed={failed} />;
}
