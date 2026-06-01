import type { NaturalEvent } from "../api";
import { categoryStyle } from "../categories";

function formatDate(iso: string | null): string {
  if (!iso) return "Data indisponível";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Data indisponível";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventCard({ event }: { event: NaturalEvent }) {
  const { borderClass, icon } = categoryStyle(event.categoryId);
  const [lon, lat] = event.coordinates;
  const hasCoords = typeof lon === "number" && typeof lat === "number";

  return (
    <article
      className={`rounded-xl border border-l-[5px] border-border bg-[#fcfdff] p-4 ${borderClass}`}
    >
      <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {icon} {event.category}
      </span>
      <h3 className="my-1.5 text-[15px] font-bold">{event.title}</h3>
      <p className="text-[13px] text-gray-500">{formatDate(event.date)}</p>
      {hasCoords && (
        <p className="text-[13px] text-gray-500">
          📍 {lat.toFixed(2)}, {lon.toFixed(2)}
        </p>
      )}
      {event.source && (
        <a
          href={event.source}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[13px] font-semibold text-storm hover:underline"
        >
          Ver fonte →
        </a>
      )}
    </article>
  );
}
