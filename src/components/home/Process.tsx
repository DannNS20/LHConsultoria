import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { steps } from '@/lib/site';

export function Process() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page">
        <Reveal distance={24}>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2 className="font-serif text-4xl leading-[1.08] text-ink md:text-5xl">
              Tres pasos para poner en orden tus impuestos.
            </h2>
          </div>
        </Reveal>

        <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <li aria-hidden="true" className="absolute top-[1.35rem] right-[16%] left-[16%] hidden h-px bg-sage md:block" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <Reveal delay={i * 0.12} distance={24}>
                <span className="relative z-10 mx-auto grid size-11 place-items-center rounded-full border border-forest/25 bg-paper font-serif text-lg text-forest">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
