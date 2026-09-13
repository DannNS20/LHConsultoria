'use client';

import { LogoMark } from '@/components/brand/Logo';
import CardSwap, { Card } from '@/components/CardSwap';
import { reasons } from '@/lib/site';

/** Tarjetas apiladas que rotan solas (escritorio) y lista sencilla en pantallas chicas. */
export function ReasonsSwap() {
  return (
    <>
      <div className="relative hidden h-[32rem] lg:block">
        <CardSwap width={420} height={290} cardDistance={46} verticalDistance={54} delay={4200} skewAmount={4} pauseOnHover>
          {reasons.map((reason, i) => (
            <Card
              key={reason.title}
              className="overflow-hidden rounded-3xl border border-white/20 bg-white p-8 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)]"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-forest uppercase">
                {String(i + 1).padStart(2, '0')} · Por qué elegirnos
              </p>
              <h3 className="mt-6 font-serif text-3xl">{reason.title}</h3>
              <p className="mt-4 leading-relaxed text-muted">{reason.description}</p>
              <LogoMark className="absolute right-8 bottom-7 h-6 w-10 text-forest" />
            </Card>
          ))}
        </CardSwap>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {reasons.map((reason, i) => (
          <li key={reason.title} className="relative rounded-3xl bg-white p-7 text-ink shadow-[0_30px_60px_-35px_rgb(0_0_0/0.6)]">
            <p className="text-xs font-semibold tracking-[0.2em] text-forest uppercase">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-4 font-serif text-2xl">{reason.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{reason.description}</p>
            <LogoMark className="absolute top-7 right-7 h-5 w-9 text-forest" />
          </li>
        ))}
      </ul>
    </>
  );
}
