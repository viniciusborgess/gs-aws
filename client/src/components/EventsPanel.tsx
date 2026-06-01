import type { EventStatus, NaturalEvent } from "../api";
import EventCard from "./EventCard";

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "open", label: "Ativos" },
  { value: "closed", label: "Encerrados" },
  { value: "all", label: "Todos" },
];

interface Props {
  events: NaturalEvent[];
  status: EventStatus;
  loading: boolean;
  error: string | null;
  generatedAt: string | null;
  onStatusChange: (status: EventStatus) => void;
  onRefresh: () => void;
}

function statusLine(props: Props): string {
  if (props.loading) return "Carregando dados da NASA…";
  if (props.error) return `⚠️ ${props.error}`;
  if (props.events.length === 0) return "Nenhum evento para o filtro atual.";
  return `${props.events.length} evento(s) carregado(s) da NASA EONET.`;
}

export default function EventsPanel(props: Props) {
  const updated = props.generatedAt
    ? `Atualizado às ${new Date(props.generatedAt).toLocaleTimeString("pt-BR")}`
    : "";

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[19px] font-bold">
          🌍 Eventos naturais em tempo real
        </h2>
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="text-[13px] text-gray-500">{updated}</span>
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value as EventStatus)}
            disabled={props.loading}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-ink disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={props.onRefresh}
            disabled={props.loading}
            className="rounded-lg bg-navy px-[18px] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {props.loading ? "Atualizando…" : "Atualizar"}
          </button>
        </div>
      </div>

      <div className="py-2 text-sm text-gray-500">{statusLine(props)}</div>

      <div className="mt-2.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {props.events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </section>
  );
}
