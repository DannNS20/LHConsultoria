'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { EditPost } from './EditPost';

function EditPostFromQuery() {
  const id = useSearchParams().get('id') ?? '';
  return <EditPost key={id} id={id} />;
}

export default function EditPostPage() {
  return (
    <Suspense fallback={null}>
      <EditPostFromQuery />
    </Suspense>
  );
}
