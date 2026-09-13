import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DemoPost, DemoPostLoading } from '@/components/blog/DemoPost';

// Lector de entradas en el navegador (?slug=). Lo usa el modo demo estático, donde no hay servidor.
export const metadata: Metadata = {
  title: 'Blog',
  robots: { index: false, follow: true },
};

export default function ReadPostPage() {
  return (
    <Suspense fallback={<DemoPostLoading />}>
      <DemoPost />
    </Suspense>
  );
}
