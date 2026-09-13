import AnimatedContent from '@/components/AnimatedContent';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}

/** Aparición suave al hacer scroll, con los mismos parámetros en todo el sitio. */
export function Reveal({ children, delay = 0, distance = 36, className }: RevealProps) {
  return (
    <AnimatedContent distance={distance} duration={0.9} delay={delay} threshold={0.12} className={className}>
      {children}
    </AnimatedContent>
  );
}
