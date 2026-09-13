'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { buttonClass } from '@/components/ui/button';
import { inputClass, labelClass } from '@/components/ui/field';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const { ready, session, login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && session) router.replace('/admin');
  }, [ready, session, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      await login(String(data.get('email') ?? ''), String(data.get('password') ?? ''));
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.');
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-forest p-12 text-white lg:flex">
        <div aria-hidden="true" className="ledger-lines-light absolute inset-0" />
        <Link href="/" className="relative">
          <Logo tone="light" className="h-14 w-auto" />
        </Link>
        <div className="relative">
          <p className="max-w-lg font-serif text-5xl leading-[1.08]">Publica, edita y comparte tu contenido en minutos.</p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            Desde este panel escribes las entradas del blog, revisas los mensajes de tus clientes y generas la imagen
            para redes sociales.
          </p>
        </div>
        <p className="relative font-serif text-lg text-white/55 italic">Nuestro balance, tu tranquilidad.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Logo className="h-9 w-auto lg:hidden" />
          <h1 className="mt-10 font-serif text-4xl lg:mt-0">Iniciar sesión</h1>
          <p className="mt-2 text-muted">Panel de administración de LH Consultores.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={labelClass}>
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                defaultValue="demo@lhconsultores.test"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                defaultValue="Demo2026!"
                className={inputClass}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={pending} className={buttonClass('primary', 'lg', 'w-full')}>
              {pending && <LoaderCircle className="size-5 animate-spin" />}
              Entrar al panel
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed border-forest/30 bg-sage-soft/50 p-4 text-sm text-ink-2">
            <p className="font-semibold text-forest">Acceso de demostración</p>
            <p className="mt-1">Los datos ya vienen escritos; solo presiona “Entrar al panel”.</p>
          </div>

          <Link href="/" className="mt-8 inline-flex text-sm text-muted hover:text-ink">
            ← Volver al sitio
          </Link>
        </div>
      </main>
    </div>
  );
}
