import { api } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import type { PostSummary } from '@/lib/types';
import { DemoLatestPosts } from './DemoLatestPosts';
import { LatestPostsView } from './LatestPostsView';

export async function LatestPosts() {
  if (DEMO_MODE) return <DemoLatestPosts />;

  let posts: PostSummary[] = [];
  let failed = false;
  try {
    posts = (await api.posts({ limit: 3 })).items;
  } catch {
    failed = true;
  }
  return <LatestPostsView posts={posts} failed={failed} />;
}

export function LatestPostsSkeleton() {
  return <LatestPostsView posts={null} />;
}
