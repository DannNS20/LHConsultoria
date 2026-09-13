import Link from 'next/link';
import { buttonClass } from '@/components/ui/button';

export default function PostNotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-32 pb-20 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-forest uppercase">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl">No encontramos esta entrada</h1>
      <p className="mt-4 max-w-md text-lg text-muted">Es posible que se haya retirado o que la liga tenga un error.</p>
      <Link href="/blog" className={buttonClass('primary', 'lg', 'mt-10')}>
        Ver el blog
      </Link>
    </section>
  );
}
