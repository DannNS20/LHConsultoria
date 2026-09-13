import { BellRing, Check } from 'lucide-react';
import { LogoMark } from '@/components/brand/Logo';

const rows = [
  { label: 'Declaración mensual ISR e IVA', detail: 'Presentada' },
  { label: 'Nómina timbrada', detail: 'Al corriente' },
  { label: 'Contabilidad electrónica', detail: 'Enviada' },
  { label: 'Buzón tributario', detail: 'Sin avisos' },
];

/** Ilustración del tipo de tranquilidad que ofrece el despacho (datos de ejemplo). */
export function ComplianceCard() {
  return (
    <div className="mx-auto max-w-md rounded-[1.75rem] border border-line bg-white/90 p-6 shadow-[0_40px_90px_-45px_rgb(29_42_36/0.55)] backdrop-blur sm:p-8 lg:max-w-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Estado de cumplimiento</p>
          <p className="mt-1 font-serif text-2xl">Septiembre 2026</p>
        </div>
        <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-forest">Al corriente</span>
      </div>

      <ul className="mt-6 divide-y divide-line">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 py-3.5">
            <span className="flex items-center gap-3 text-[0.95rem] text-ink-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest text-white">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {row.label}
            </span>
            <span className="text-sm whitespace-nowrap text-muted">{row.detail}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 overflow-hidden rounded-2xl bg-forest p-5 text-white">
        <LogoMark className="absolute top-5 right-5 h-8 w-14 text-white" color="#C9D6CD" />
        <p className="text-xs tracking-[0.18em] text-mint uppercase">Opinión de cumplimiento</p>
        <p className="mt-1 font-serif text-3xl">Positiva</p>
        <p className="mt-4 border-t border-white/15 pt-4 text-sm text-white/75">
          Próxima fecha límite: <strong className="font-semibold text-white">17 de octubre</strong>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-paper/70 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sage-soft text-forest">
          <BellRing className="size-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">Recordatorio enviado</span>
          <span className="block text-xs text-muted">Declaración de septiembre</span>
        </span>
        <span className="ml-auto text-xs text-muted">Hoy</span>
      </div>
    </div>
  );
}
