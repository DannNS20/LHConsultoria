'use client';

import LogoLoop, { type LogoItem } from '@/components/LogoLoop';

const TOPICS = [
  'Declaración anual',
  'CFDI 4.0',
  'Nómina e IMSS',
  'Buzón tributario',
  'RESICO',
  'Opinión de cumplimiento',
  'Contabilidad electrónica',
  'e.firma',
  'Impuesto sobre nómina',
  'Constitución de empresas',
];

const ITEMS: LogoItem[] = TOPICS.map((topic) => ({
  title: topic,
  node: (
    <span className="inline-flex items-center gap-5 font-serif text-2xl whitespace-nowrap text-ink/80">
      <span className="size-2 rounded-full bg-forest" />
      {topic}
    </span>
  ),
}));

/** Franja en movimiento con los temas en los que ayuda el despacho. */
export function TopicsLoop() {
  return (
    <section aria-label="Temas en los que te ayudamos" className="border-y border-line bg-white py-7">
      <LogoLoop
        logos={ITEMS}
        speed={55}
        gap={56}
        logoHeight={28}
        pauseOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Temas fiscales y contables"
      />
    </section>
  );
}
