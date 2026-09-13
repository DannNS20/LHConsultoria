import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { WhatsAppIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { site, whatsappLink } from '@/lib/site';
import { ContactForm } from './ContactForm';

export function Contact() {
  const items = [
    { icon: Phone, label: 'Teléfono', value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Correo', value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: MapPin, label: 'Ubicación', value: site.contact.address },
    { icon: Clock, label: 'Horario', value: site.contact.hours },
  ];

  return (
    <section id="contacto" className="border-t border-line bg-paper-2/60 py-24 md:py-32">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal distance={24}>
          <Eyebrow>Contacto</Eyebrow>
          <h2 className="font-serif text-4xl leading-[1.08] text-ink md:text-5xl">Platiquemos de tu situación.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            Ya sea que empieces tu negocio o necesites regularizarte ante el SAT, el primer paso es una conversación.
          </p>

          <ul className="mt-10 space-y-5">
            {items.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-white text-forest">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-xs tracking-[0.15em] text-muted uppercase">{label}</span>
                  {href ? (
                    <a href={href} className="text-ink transition hover:text-forest">
                      {value}
                    </a>
                  ) : (
                    <span className="text-ink">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-3xl bg-forest p-7 text-white">
            <p className="font-serif text-2xl">¿Prefieres WhatsApp?</p>
            <p className="mt-2 text-white/70">Escríbenos y te respondemos en horario de oficina.</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={buttonClass('light', 'md', 'mt-6')}>
              <WhatsAppIcon className="size-4" />
              Abrir WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal distance={32} delay={0.1}>
          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgb(29_42_36/0.5)] sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
