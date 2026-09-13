'use client';

import { useEffect } from 'react';
import { buttonClass } from '@/components/ui/button';

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-20 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-forest uppercase">Algo salió mal</p>
      <h1 className="mt-4 font-serif text-5xl">No pudimos cargar esta página</h1>
      <p className="mt-4 max-w-md text-lg text-muted">Puede ser un problema momentáneo de conexión. Intenta de nuevo.</p>
      <button type="button" onClick={() => retry()} className={buttonClass('primary', 'lg', 'mt-10')}>
        Intentar de nuevo
      </button>
    </section>
  );
}
