'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, MessagesSquare, Receipt, ShieldCheck, Users } from 'lucide-react';
import { useRef } from 'react';
import { GlobalSpotlight, ParticleCard } from '@/components/MagicBento';
import { buttonClass } from '@/components/ui/button';
import { services } from '@/lib/site';

const FOREST = '47, 66, 57';
const MINT = '201, 214, 205';

const icons = {
  ledger: BookOpen,
  receipt: Receipt,
  people: Users,
  shield: ShieldCheck,
  building: Building2,
  chat: MessagesSquare,
};

// Distribución tipo bento en escritorio: [0 0 1] / [2 3 4] / [5 5 CTA]
const spans = ['lg:col-span-2', '', '', '', '', 'lg:col-span-2'];

export function ServicesBento() {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={gridRef} className="bento-section relative mt-14 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(14rem,auto)] lg:grid-cols-3">
      <GlobalSpotlight gridRef={gridRef} glowColor={FOREST} spotlightRadius={320} blendMode="multiply" />

      {services.map((service, i) => {
        const Icon = icons[service.icon];
        const featured = i === 0;
        return (
          <ParticleCard
            key={service.title}
            className={`card card--border-glow group flex flex-col rounded-3xl border p-7 transition-shadow duration-500 ${spans[i]} ${
              featured ? 'glow-light border-forest bg-forest text-white' : 'border-line bg-white text-ink'
            }`}
            glowColor={featured ? MINT : FOREST}
            particleCount={10}
            enableTilt={false}
            enableMagnetism
            clickEffect
          >
            <div className="relative z-[2] flex h-full flex-col">
              <span
                className={`grid size-12 place-items-center rounded-2xl transition-colors duration-500 ${
                  featured ? 'bg-white/10 text-mint' : 'bg-sage-soft text-forest group-hover:bg-forest group-hover:text-white'
                }`}
              >
                <Icon className="size-5" />
              </span>
              <h3 className={`mt-6 ${featured ? 'font-serif text-3xl' : 'text-xl font-semibold'}`}>{service.title}</h3>
              <p className={`mt-3 leading-relaxed ${featured ? 'max-w-md text-lg text-white/75' : 'text-muted'}`}>
                {service.description}
              </p>
            </div>
          </ParticleCard>
        );
      })}

      <ParticleCard
        className="card card--border-glow glow-light group flex flex-col justify-between rounded-3xl border border-forest-deep bg-forest-deep p-7 text-white"
        glowColor={MINT}
        particleCount={14}
        enableTilt={false}
        enableMagnetism
        clickEffect
      >
        <div className="relative z-[2]">
          <p className="text-xs font-semibold tracking-[0.2em] text-mint uppercase">¿No ves tu caso?</p>
          <p className="mt-4 font-serif text-2xl leading-snug">Cuéntanos tu situación y te decimos cómo ayudarte.</p>
        </div>
        <Link href="/#contacto" className={buttonClass('light', 'md', 'group/cta relative z-[2] mt-6 self-start')}>
          Contáctanos
          <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
        </Link>
      </ParticleCard>
    </div>
  );
}
