import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import Magnet from '@/components/Magnet';
import RotatingText from '@/components/RotatingText';
import SplitText from '@/components/SplitText';
import Threads from '@/components/Threads';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { site } from '@/lib/site';
import { ComplianceCard } from './ComplianceCard';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div
        aria-hidden="true"
        className="ledger-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_15%,transparent_75%)]"
      />
      {/* Líneas en movimiento: evocan el balance del logotipo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-16 h-[60%] opacity-40 [mask-image:linear-gradient(to_top,black_35%,transparent)]"
      >
        <Threads color={[0.184, 0.259, 0.224]} amplitude={1.3} distance={0.15} />
      </div>

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <AnimatedContent distance={16} duration={0.8}>
            <Eyebrow className="mb-0">Despacho contable</Eyebrow>
          </AnimatedContent>

          <SplitText
            tag="h1"
            text={site.tagline}
            splitType="words"
            textAlign="left"
            delay={80}
            duration={1.1}
            from={{ opacity: 0, y: 36 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="0px"
            className="mt-7 font-serif text-[3rem] leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.6rem]"
          />

          <AnimatedContent distance={20} duration={0.9} delay={0.4}>
            <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl text-ink-2 sm:text-[1.7rem]">
              <span>Contabilidad clara para</span>
              <RotatingText
                texts={['personas físicas', 'empresas', 'emprendedores', 'profesionistas']}
                mainClassName="overflow-hidden rounded-xl bg-forest px-3 py-1 font-serif text-white shadow-[0_12px_30px_-14px_rgb(47_66_57/0.9)] sm:py-1.5"
                splitLevelClassName="overflow-hidden pb-1"
                staggerFrom="last"
                staggerDuration={0.025}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2600}
              />
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Nos encargamos de tus obligaciones ante el SAT, el IMSS y tu estado, y te lo explicamos sin tecnicismos.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnet padding={50} magnetStrength={5}>
                <Link href="/#contacto" className={buttonClass('primary', 'lg', 'group')}>
                  Agenda una asesoría
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnet>
              <Link href="/#servicios" className={buttonClass('secondary', 'lg')}>
                Conoce los servicios
              </Link>
            </div>
          </AnimatedContent>
        </div>

        <AnimatedContent distance={48} duration={1.1} delay={0.25}>
          <ComplianceCard />
        </AnimatedContent>
      </div>
    </section>
  );
}
