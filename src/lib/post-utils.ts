import type { Block } from './types';

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function slugify(value: string): string {
  return (
    normalize(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
      .replace(/-+$/g, '') || 'entrada'
  );
}

export function readingMinutes(blocks: Block[]): number {
  const words = blocks
    .flatMap((b) => [b.text ?? '', ...(b.items ?? [])])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
