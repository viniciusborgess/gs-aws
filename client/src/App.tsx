import { useCallback, useEffect, useState } from "react";
import {
  fetchEvents,
  type EventStatus,
  type EventsResponse,
} from "./api";
import Hero from "./components/Hero";
import InfoCards from "./components/InfoCards";
import Kpis from "./components/Kpis";
import EventsPanel from "./components/EventsPanel";
import ApodCard from "./components/ApodCard";
import Footer from "./components/Footer";

export default function App() {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [status, setStatus] = useState<EventStatus>("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((next: EventStatus) => {
    setLoading(true);
    setError(null);
    fetchEvents(next, 100)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Falha ao carregar.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(status);
  }, [status, load]);

  const events = data?.events ?? [];

  return (
    <div className="min-h-screen">
      <Hero />
      <main className="mx-auto -mt-9 max-w-[1080px] space-y-[22px] px-5 pb-10">
        <InfoCards />
        <Kpis events={events} total={data?.total ?? 0} loading={loading} />
        <EventsPanel
          events={events}
          status={status}
          loading={loading}
          error={error}
          generatedAt={data?.generatedAt ?? null}
          onStatusChange={setStatus}
          onRefresh={() => load(status)}
        />
        <ApodCard />
      </main>
      <Footer />
    </div>
  );
}
