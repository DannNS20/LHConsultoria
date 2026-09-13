import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { WhatsAppIcon } from '@/components/ui/icons';
import { whatsappLink } from '@/lib/site';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgb(37_211_102/0.7)] transition hover:scale-105"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </>
  );
}
