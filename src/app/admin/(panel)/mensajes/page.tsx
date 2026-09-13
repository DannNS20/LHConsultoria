'use client';

import { Check, LoaderCircle, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ErrorNotice, PageHeader, formatDateTime } from '@/components/admin/ui';
import { buttonClass } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { ContactMessage } from '@/lib/types';

export default function MessagesPage() {
  const { session, errorMessage } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api.admin
      .messages(session.token)
      .then((result) => !cancelled && setMessages(result))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [session, errorMessage]);

  async function markRead(id: string) {
    if (!session) return;
    try {
      const updated = await api.admin.markRead(session.token, id);
      setMessages((current) => current?.map((m) => (m.id === id ? updated : m)) ?? null);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const unread = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Mensajes"
        description={
          messages ? `Solicitudes recibidas desde el formulario de contacto · ${unread} sin leer` : 'Solicitudes recibidas desde el formulario de contacto.'
        }
      />

      <div className="mt-6">
        <ErrorNotice message={error} />
      </div>

      <div className="mt-6 space-y-4">
        {messages === null && !error && (
          <div className="grid place-items-center py-16">
            <LoaderCircle className="size-6 animate-spin text-forest" aria-label="Cargando mensajes" />
          </div>
        )}
        {messages?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">Aún no hay mensajes.</p>
        )}
        {messages?.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border bg-white p-6 ${m.read ? 'border-line' : 'border-forest/30 shadow-[0_20px_50px_-35px_rgb(29_42_36/0.5)]'}`}
          >
            <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {!m.read && <span className="size-2 rounded-full bg-forest" aria-label="Sin leer" />}
              <h2 className="font-semibold text-ink">{m.name}</h2>
              {m.service && (
                <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-forest">{m.service}</span>
              )}
              <time dateTime={m.createdAt} className="ml-auto text-xs text-muted">
                {formatDateTime(m.createdAt)}
              </time>
            </header>

            <p className="mt-4 leading-relaxed whitespace-pre-line text-ink-2">{m.message}</p>

            <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <a href={`mailto:${m.email}`} className={buttonClass('ghost', 'sm')}>
                <Mail className="size-4" />
                {m.email}
              </a>
              {m.phone && (
                <a href={`tel:${m.phone.replace(/\s/g, '')}`} className={buttonClass('ghost', 'sm')}>
                  <Phone className="size-4" />
                  {m.phone}
                </a>
              )}
              {!m.read && (
                <button type="button" onClick={() => markRead(m.id)} className={buttonClass('secondary', 'sm', 'ml-auto')}>
                  <Check className="size-4" />
                  Marcar como leído
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
