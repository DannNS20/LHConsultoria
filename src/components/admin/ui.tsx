import type { PostStatus } from '@/lib/types';

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow}
        <h1 className="font-serif text-4xl text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return status === 'published' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-xs font-semibold text-forest">
      <span className="size-1.5 rounded-full bg-forest" />
      Publicada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-muted">
      <span className="size-1.5 rounded-full bg-sage" />
      Borrador
    </span>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-white p-6 ${className}`}>{children}</section>;
}

export function ErrorNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </p>
  );
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}
