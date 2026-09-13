import Image from 'next/image';
import logo from '@/assets/brand/logo.png';

// Logotipo oficial de LH Consultores: se usa el archivo tal como lo entregó el despacho, sin recortes ni cambios.

interface LogoProps {
  className?: string;
  /** 'light' para fondos oscuros: el logo va sobre un recuadro blanco. */
  tone?: 'dark' | 'light';
  eager?: boolean;
}

export function Logo({ className = '', tone = 'dark', eager = false }: LogoProps) {
  const image = (
    <Image
      src={logo}
      alt="LH Consultores"
      unoptimized
      loading={eager ? 'eager' : undefined}
      // En fondos claros, "multiply" funde el blanco del archivo con el fondo sin modificar la imagen.
      className={`${tone === 'dark' ? 'mix-blend-multiply' : ''} ${className}`}
    />
  );

  if (tone === 'dark') return image;
  return <span className="inline-flex rounded-2xl bg-white px-2 py-1">{image}</span>;
}

/** Solo el símbolo (línea + punto), para íconos y detalles decorativos. */
export function LogoMark({ className, color = '#34463C' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="21" x2="40" y2="21" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="26" cy="8" r="5" fill={color} />
    </svg>
  );
}
