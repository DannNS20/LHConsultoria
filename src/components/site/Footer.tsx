import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { nav, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-forest-deep text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo tone="light" className="h-20 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{site.description}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-mint uppercase">Navegación</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/" className="text-white/75 transition hover:text-white">
                Inicio
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/75 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-mint uppercase">Contacto</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="transition hover:text-white">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li>{site.contact.address}</li>
            <li>{site.contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} LH Consultores. Todos los derechos reservados.</p>
          <p>Vista previa desarrollada por Dann Studio</p>
        </div>
      </div>
    </footer>
  );
}
