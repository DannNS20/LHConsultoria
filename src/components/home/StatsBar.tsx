import CountUp from '@/components/CountUp';
import { stats } from '@/lib/site';

export function StatsBar() {
  return (
    <section aria-label="Cifras del despacho" className="border-y border-line bg-white/60">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-4 sm:justify-center">
            <span className="font-serif text-5xl text-forest tabular-nums">
              <CountUp to={stat.value} duration={1.6} />
              {stat.suffix}
            </span>
            <span className="max-w-[9rem] text-sm leading-snug text-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
