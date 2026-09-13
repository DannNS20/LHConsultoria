import Image from 'next/image';
import { categoryNames } from '@/lib/site';
import type { CategorySlug } from '@/lib/types';

const tones: Record<CategorySlug, string> = {
  impuestos: 'bg-forest',
  sat: 'bg-forest-deep',
  nomina: 'bg-forest-2',
  empresas: 'bg-[#5a5140]',
  'finanzas-personales': 'bg-[#45605a]',
};

interface PostCoverProps {
  title: string;
  category: CategorySlug;
  coverUrl: string | null;
  className?: string;
  sizes?: string;
}

/** Portada de la entrada: la imagen subida o, si no hay, una portada generada con la identidad del despacho. */
export function PostCover({ title, category, coverUrl, className = '', sizes = '(min-width: 768px) 33vw, 100vw' }: PostCoverProps) {
  if (coverUrl) {
    return (
      <div className={`relative overflow-hidden bg-paper-2 ${className}`}>
        <Image src={coverUrl} alt={title} fill unoptimized sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`relative overflow-hidden ${tones[category]} ${className}`}>
      <div className="ledger-lines-light absolute inset-0" />
      <span className="absolute right-0 bottom-[36%] h-[3px] w-1/2 bg-white/15" />
      <span className="absolute right-[18%] bottom-[36%] aspect-square w-[15%] -translate-y-1/2 rounded-full bg-mint/25" />
      <span className="absolute bottom-5 left-6 text-xs font-semibold tracking-[0.2em] text-mint uppercase">
        {categoryNames[category]}
      </span>
    </div>
  );
}
