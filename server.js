"use strict";

/**
 * SpaceGuard - Servidor Express
 * --------------------------------------------------------------------------
 * Monitoramento de eventos naturais em tempo real usando dados espaciais da
 * NASA. A aplicacao consome a API EONET (Earth Observatory Natural Event
 * Tracker), que rastreia eventos naturais detectados por satelites, e expoe
 * um dashboard + uma API propria para a solucao da Global Solution.
 *
 * Observabilidade: integracao com Azure Application Insights (ativada apenas
 * quando a connection string estiver presente no ambiente).
 */

// ---------------------------------------------------------------------------
// Application Insights (Monitoramento) - precisa ser carregado o mais cedo
// possivel, antes de qualquer outro require que gere telemetria.
// ---------------------------------------------------------------------------
const appInsights = require("applicationinsights");
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup()
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setSendLiveMetrics(true)
    .start();
  console.log("[SpaceGuard] Application Insights ATIVO.");
} else {
  console.log(
    "[SpaceGuard] Application Insights inativo (connection string ausente)."
  );
}

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// A NASA_API_KEY vem do Azure Key Vault via referencia de App Setting.
// "DEMO_KEY" e o fallback publico da NASA (rate limit baixo).
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

const EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events";
const APOD_URL = "https://api.nasa.gov/planetary/apod";

// Cache simples em memoria para nao estourar o rate limit da NASA.
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

async function fetchWithCache(key, url) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.data;
  }
  const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!resp.ok) {
    throw new Error(`NASA respondeu ${resp.status}`);
  }
  const data = await resp.json();
  cache.set(key, { at: Date.now(), data });
  return data;
}

// ---------------------------------------------------------------------------
// Middlewares
// ---------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Healthcheck - usado pelo Azure (e pela Alert Rule de disponibilidade).
 */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "SpaceGuard",
    uptime_s: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Eventos naturais em tempo real (EONET / NASA).
 * Query params opcionais:
 *   - status: "open" (default) | "closed" | "all"
 *   - limit:  numero maximo de eventos (default 50)
 */
app.get("/api/events", async (req, res) => {
  try {
    const status = ["open", "closed", "all"].includes(req.query.status)
      ? req.query.status
      : "open";
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    const url = `${EONET_URL}?status=${status}&limit=${limit}`;
    const data = await fetchWithCache(`events:${status}:${limit}`, url);

    const events = (data.events || []).map((ev) => {
      const last = ev.geometry?.[ev.geometry.length - 1] || {};
      const coords = last.coordinates || [];
      return {
        id: ev.id,
        title: ev.title,
        category: ev.categories?.[0]?.title || "Desconhecido",
        categoryId: ev.categories?.[0]?.id || "unknown",
        date: last.date || null,
        closed: ev.closed || null,
        coordinates: coords, // [lon, lat]
        source: ev.sources?.[0]?.url || null,
      };
    });

    // Resumo por categoria para os cards do dashboard.
    const byCategory = {};
    for (const ev of events) {
      byCategory[ev.category] = (byCategory[ev.category] || 0) + 1;
    }

    res.json({
      generatedAt: new Date().toISOString(),
      total: events.length,
      byCategory,
      events,
    });
  } catch (err) {
    console.error("[SpaceGuard] Erro ao buscar eventos EONET:", err.message);
    // Telemetria explicita de excecao para o Application Insights.
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackException({ exception: err });
    }
    res.status(502).json({ error: "Falha ao consultar a NASA EONET." });
  }
});

/**
 * Astronomy Picture of the Day - demonstra o uso real da NASA_API_KEY
 * carregada do Key Vault.
 */
app.get("/api/apod", async (_req, res) => {
  try {
    const url = `${APOD_URL}?api_key=${NASA_API_KEY}`;
    const data = await fetchWithCache("apod", url);
    res.json({
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      mediaType: data.media_type,
      date: data.date,
      usingDemoKey: NASA_API_KEY === "DEMO_KEY",
    });
  } catch (err) {
    console.error("[SpaceGuard] Erro ao buscar APOD:", err.message);
    res.status(502).json({ error: "Falha ao consultar a NASA APOD." });
  }
});

// Fallback SPA -> index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`[SpaceGuard] Servidor no ar na porta ${PORT}`);
});

module.exports = app;
