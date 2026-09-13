interface EyebrowProps {
  children: React.ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Etiqueta de sección con el símbolo de balance del logotipo. */
export function Eyebrow({ children, tone = 'dark', className = '' }: EyebrowProps) {
  const light = tone === 'light';
  return (
    <p
      className={`mb-5 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase ${light ? 'text-mint' : 'text-forest'} ${className}`}
    >
      <span aria-hidden="true" className="relative inline-block h-3 w-7">
        <span className={`absolute inset-x-0 bottom-0 h-px ${light ? 'bg-white/40' : 'bg-forest/35'}`} />
        <span className={`absolute top-0 left-3.5 size-1.5 rounded-full ${light ? 'bg-mint' : 'bg-forest'}`} />
      </span>
      {children}
    </p>
  );
}
