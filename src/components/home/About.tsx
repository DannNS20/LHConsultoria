import TiltedCard from '@/components/TiltedCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/config';
import { site } from '@/lib/site';

export function About() {
  return (
    <section id="nosotros" className="py-24 md:py-32">
      <div className="container-page grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative lg:pr-8">
            <TiltedCard
              imageSrc={asset('/placeholders/titular.svg')}
              altText={`Espacio para la fotografía de ${site.owner.name}`}
              containerHeight="34rem"
              containerWidth="100%"
              imageHeight="34rem"
              imageWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent
              overlayContent={
                <div className="flex h-full flex-col justify-end p-8 text-white">
                  <p className="font-serif text-3xl">{site.owner.name}</p>
                  <p className="mt-1 text-sm text-mint">{site.owner.role}</p>
                </div>
              }
            />

            <figure className="relative mt-6 rounded-2xl border border-line bg-white p-6 shadow-[0_30px_70px_-35px_rgb(29_42_36/0.5)] lg:absolute lg:-top-8 lg:-right-4 lg:mt-0 lg:max-w-[17rem]">
              <blockquote className="font-serif text-xl leading-snug text-ink italic">
                “Mi compromiso es que entiendas tus números tan bien como yo.”
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted">{site.owner.name}</figcaption>
            </figure>
          </div>
        </Reveal>

        <div>
          <Reveal distance={24}>
            <Eyebrow>Nosotros</Eyebrow>
            <h2 className="font-serif text-4xl leading-[1.08] text-ink md:text-5xl">
              Un despacho cercano, con la precisión que tus números necesitan.
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-2">
              <p>
                En LH Consultores acompañamos a personas físicas, profesionistas y empresas en el cumplimiento de sus
                obligaciones contables y fiscales, con atención directa y seguimiento puntual.
              </p>
              <p>
                Creemos que la tranquilidad financiera empieza por entender tu situación. Por eso cada declaración,
                reporte y recomendación viene acompañada de una explicación clara.
              </p>
            </div>
          </Reveal>

          <Reveal distance={24} delay={0.15}>
            <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold tracking-[0.18em] text-forest uppercase">Misión</dt>
                <dd className="mt-2 leading-relaxed text-muted">
                  Dar certeza fiscal a nuestros clientes para que se enfoquen en hacer crecer su patrimonio y su negocio.
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-[0.18em] text-forest uppercase">Visión</dt>
                <dd className="mt-2 leading-relaxed text-muted">
                  Ser el despacho de confianza de la región por nuestra cercanía, claridad y cumplimiento.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
