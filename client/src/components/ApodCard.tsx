import { useEffect, useState } from "react";
import { fetchApod, type Apod } from "../api";

// Demonstra o uso real da NASA_API_KEY carregada do Key Vault: a "Imagem
// Astronomica do Dia" (APOD) so existe porque o backend assina a chamada.
export default function ApodCard() {
  const [apod, setApod] = useState<Apod | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchApod()
      .then(setApod)
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card md:grid md:grid-cols-2">
      <div className="min-h-[220px] bg-navy">
        {apod ? (
          apod.mediaType === "image" ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <iframe
              title={apod.title}
              src={apod.url}
              className="h-full min-h-[220px] w-full"
              allowFullScreen
            />
          )
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center text-white/60">
            Carregando imagem da NASA…
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          🔭 NASA · Imagem astronômica do dia
        </span>
        <h2 className="my-2 text-lg font-bold">
          {apod?.title ?? "Carregando…"}
        </h2>
        <p className="line-clamp-6 text-[14px] text-[#3a4257]">
          {apod?.explanation}
        </p>
        {apod && (
          <p className="mt-3 text-[12px] text-gray-400">
            {apod.date}
            {apod.usingDemoKey
              ? " · usando DEMO_KEY (defina NASA_API_KEY no Key Vault)"
              : " · autenticado via Key Vault"}
          </p>
        )}
      </div>
    </section>
  );
}
