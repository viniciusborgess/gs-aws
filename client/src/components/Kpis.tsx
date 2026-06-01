import type { NaturalEvent } from "../api";

function countBy(events: NaturalEvent[], categoryId: string): number {
  return events.filter((e) => e.categoryId === categoryId).length;
}

function Kpi({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 text-center shadow-card">
      <span className="block text-4xl font-extrabold text-navy">{value}</span>
      <span className="text-[13px] uppercase tracking-wide text-gray-500">
        {label}
      </span>
    </div>
  );
}

export default function Kpis({
  events,
  total,
  loading,
}: {
  events: NaturalEvent[];
  total: number;
  loading: boolean;
}) {
  const dash = loading ? "—" : undefined;
  return (
    <section className="my-[22px] grid grid-cols-2 gap-[18px] md:grid-cols-4">
      <Kpi value={dash ?? total} label="Eventos ativos" />
      <Kpi value={dash ?? countBy(events, "wildfires")} label="Incêndios" />
      <Kpi value={dash ?? countBy(events, "severeStorms")} label="Tempestades" />
      <Kpi value={dash ?? countBy(events, "volcanoes")} label="Vulcões" />
    </section>
  );
}
