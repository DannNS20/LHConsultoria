const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary: 'bg-forest text-white shadow-[0_10px_30px_-14px_rgb(47_66_57/0.8)] hover:bg-forest-deep',
  secondary: 'border border-ink/15 bg-white/70 text-ink hover:border-forest/40 hover:bg-white',
  light: 'bg-white text-forest hover:bg-mint',
  ghost: 'text-ink-2 hover:bg-ink/5 hover:text-ink',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

export function buttonClass(
  variant: keyof typeof variants = 'primary',
  size: keyof typeof sizes = 'md',
  extra = '',
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}
