import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ReasonsSwap } from './ReasonsSwap';

export function Reasons() {
  return (
    <section className="relative overflow-hidden bg-forest py-24 text-white md:py-32">
      <div aria-hidden="true" className="ledger-lines-light absolute inset-0" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal distance={24}>
          <Eyebrow tone="light">Por qué elegirnos</Eyebrow>
          <h2 className="font-serif text-4xl leading-[1.08] md:text-5xl">Tu tranquilidad también es parte del servicio.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            No solo cumplimos con el SAT: te damos visibilidad y certeza sobre lo que pasa con tus impuestos cada mes.
          </p>
        </Reveal>

        <ReasonsSwap />
      </div>
    </section>
  );
}
