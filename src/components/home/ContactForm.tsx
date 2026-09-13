'use client';

import { CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { buttonClass } from '@/components/ui/button';
import { inputClass, labelClass } from '@/components/ui/field';
import { api, ApiError } from '@/lib/api';
import { services } from '@/lib/site';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    setStatus({ kind: 'sending' });
    try {
      await api.contact({
        name: field('name'),
        email: field('email'),
        phone: field('phone') || undefined,
        service: field('service') || undefined,
        message: field('message'),
        website: field('website') || undefined,
      });
      form.reset();
      setStatus({ kind: 'sent' });
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof ApiError ? error.message : 'No se pudo enviar el mensaje. Intenta de nuevo.',
      });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-sage-soft text-forest">
          <CircleCheck className="size-8" />
        </span>
        <h3 className="mt-6 font-serif text-3xl">¡Gracias por escribirnos!</h3>
        <p className="mt-3 max-w-sm text-muted">
          Recibimos tu mensaje. Te responderemos en horario de oficina lo antes posible.
        </p>
        <button type="button" onClick={() => setStatus({ kind: 'idle' })} className={buttonClass('secondary', 'md', 'mt-8')}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const sending = status.kind === 'sending';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h3 className="font-serif text-3xl">Envíanos un mensaje</h3>
        <p className="mt-2 text-muted">Cuéntanos brevemente tu situación y te contactamos.</p>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Nombre
        </label>
        <input id="name" name="name" required maxLength={120} autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Correo electrónico
        </label>
        <input id="email" name="email" type="email" required maxLength={160} autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Teléfono <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={inputClass} />
      </div>
      <div>
        <label htmlFor="service" className={labelClass}>
          Servicio de interés
        </label>
        <select id="service" name="service" defaultValue="" className={inputClass}>
          <option value="">Selecciona una opción</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          ¿En qué podemos ayudarte?
        </label>
        <textarea id="message" name="message" required rows={5} maxLength={4000} className={`${inputClass} resize-y`} />
      </div>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="hidden">
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2">
          {status.message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">Tus datos solo se usan para responder tu solicitud.</p>
        <button type="submit" disabled={sending} className={buttonClass('primary', 'lg')}>
          {sending ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-4" />}
          {sending ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
}
