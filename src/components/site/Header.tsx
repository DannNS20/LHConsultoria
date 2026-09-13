'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import GlassSurface from '@/components/GlassSurface';
import { buttonClass } from '@/components/ui/button';
import { nav } from '@/lib/site';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <GlassSurface
        width="100%"
        height={64}
        borderRadius={999}
        // Casi blanco para que el fondo blanco del logo oficial (GIF) se funda con la barra.
        backgroundOpacity={scrolled || open ? 0.96 : 0.9}
        brightness={62}
        opacity={0.9}
        blur={12}
        saturation={1.3}
        displace={0.4}
        distortionScale={-110}
        className="mx-auto max-w-6xl"
      >
        <div className="flex w-full items-center justify-between gap-4 pr-1 pl-3 sm:pl-5">
          <Link href="/" aria-label="LH Consultores, ir al inicio" className="shrink-0">
            <Logo eager className="h-11 w-auto rounded-full sm:h-12" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[0.95rem] text-ink-2 transition-colors hover:bg-white/70 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/#contacto" className={buttonClass('primary', 'md')}>
              Agenda una asesoría
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="grid size-11 place-items-center rounded-full text-ink hover:bg-white/70 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </GlassSurface>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Principal móvil"
          className="mx-auto mt-2 flex max-w-6xl flex-col rounded-3xl border border-line bg-paper/95 p-5 shadow-xl backdrop-blur-xl md:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-serif text-2xl text-ink last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#contacto" onClick={() => setOpen(false)} className={buttonClass('primary', 'lg', 'mt-4')}>
            Agenda una asesoría
          </Link>
        </nav>
      )}
    </header>
  );
}
