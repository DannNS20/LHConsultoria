'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, FileText, Inbox, LayoutDashboard, LoaderCircle, LogOut, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Logo } from '@/components/brand/Logo';
import { buttonClass } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { DEMO_MODE } from '@/lib/config';

const links = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/admin/entradas', label: 'Entradas', icon: FileText, exact: false },
  { href: '/admin/mensajes', label: 'Mensajes', icon: Inbox, exact: false },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { ready, session, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !session) router.replace('/admin/login');
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="grid min-h-dvh place-items-center bg-paper">
        <LoaderCircle className="size-6 animate-spin text-forest" aria-label="Cargando" />
      </div>
    );
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-white px-5 py-6 lg:flex">
        <Link href="/admin" className="px-2">
          <Logo className="h-8 w-auto" />
        </Link>

        <Link href="/admin/entradas/nueva" className={buttonClass('primary', 'md', 'mt-8 w-full')}>
          <Plus className="size-4" />
          Nueva entrada
        </Link>

        <nav aria-label="Panel" className="mt-6 space-y-1">
          {links.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href, exact) ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition ${
                isActive(href, exact) ? 'bg-sage-soft font-medium text-forest' : 'text-ink-2 hover:bg-paper'
              }`}
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-line pt-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-ink-2 hover:bg-paper"
          >
            <ExternalLink className="size-4.5" />
            Ver sitio
          </Link>
          <div className="px-3 py-3">
            <p className="text-sm font-semibold text-ink">{session.user.name}</p>
            <p className="truncate text-xs text-muted">{session.user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-ink-2 hover:bg-paper"
          >
            <LogOut className="size-4.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <Link href="/admin">
              <Logo className="h-7 w-auto" />
            </Link>
            <button type="button" onClick={logout} aria-label="Cerrar sesión" className="grid size-10 place-items-center rounded-full hover:bg-paper">
              <LogOut className="size-5" />
            </button>
          </div>
          <nav aria-label="Panel móvil" className="flex gap-1 overflow-x-auto px-3 pb-3">
            {[...links, { href: '/admin/entradas/nueva', label: 'Nueva', icon: Plus, exact: true }].map(
              ({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm ${
                    isActive(href, exact) ? 'bg-forest text-white' : 'bg-paper text-ink-2'
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          {DEMO_MODE && (
            <p className="mb-6 rounded-xl border border-dashed border-forest/30 bg-sage-soft/50 px-4 py-3 text-sm text-ink-2">
              <span className="font-semibold text-forest">Versión demo:</span> lo que publiques o edites se guarda solo en
              este navegador.
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
