// Tipos e funcoes de acesso a API do proprio backend Express do SpaceGuard.
// O front nunca fala direto com a NASA: quem tem a NASA_API_KEY (do Key Vault)
// e faz cache e o servidor.

export type EventStatus = "open" | "closed" | "all";

export interface NaturalEvent {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  date: string | null;
  closed: string | null;
  coordinates: number[]; // [lon, lat]
  source: string | null;
}

export interface EventsResponse {
  generatedAt: string;
  total: number;
  byCategory: Record<string, number>;
  events: NaturalEvent[];
}

export interface Apod {
  title: string;
  explanation: string;
  url: string;
  mediaType: string;
  date: string;
  usingDemoKey: boolean;
}

async function getJson<T>(url: string): Promise<T> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Servidor respondeu ${resp.status}`);
  }
  return (await resp.json()) as T;
}

export function fetchEvents(
  status: EventStatus = "open",
  limit = 50
): Promise<EventsResponse> {
  return getJson<EventsResponse>(`/api/events?status=${status}&limit=${limit}`);
}

export function fetchApod(): Promise<Apod> {
  return getJson<Apod>("/api/apod");
}
