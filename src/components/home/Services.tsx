import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ServicesBento } from './ServicesBento';

export function Services() {
  return (
    <section id="servicios" className="border-y border-line bg-paper-2/60 py-24 md:py-32">
      <div className="container-page">
        <Reveal distance={24}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <Eyebrow>Servicios</Eyebrow>
              <h2 className="max-w-2xl font-serif text-4xl leading-[1.08] text-ink md:text-5xl">
                Todo lo que tu contabilidad necesita, en un solo lugar.
              </h2>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-ink-2 lg:justify-self-end">
              Desde tu declaración anual hasta la nómina de tu empresa: te acompañamos en cada obligación con un plan
              claro.
            </p>
          </div>
        </Reveal>

        <Reveal distance={40} delay={0.1}>
          <ServicesBento />
        </Reveal>
      </div>
    </section>
  );
}
