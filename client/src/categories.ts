// Mapeia o categoryId vindo da EONET para a aparencia do card (cor da borda
// lateral e icone). Categorias nao mapeadas caem no fallback neutro.

interface CategoryStyle {
  borderClass: string;
  icon: string;
}

const STYLES: Record<string, CategoryStyle> = {
  wildfires: { borderClass: "border-l-fire", icon: "🔥" },
  severeStorms: { borderClass: "border-l-storm", icon: "🌀" },
  volcanoes: { borderClass: "border-l-volcano", icon: "🌋" },
  seaLakeIce: { borderClass: "border-l-ice", icon: "🧊" },
  floods: { borderClass: "border-l-storm", icon: "🌊" },
  earthquakes: { borderClass: "border-l-volcano", icon: "🌎" },
  drought: { borderClass: "border-l-volcano", icon: "🏜️" },
};

const FALLBACK: CategoryStyle = {
  borderClass: "border-l-navy",
  icon: "🛰️",
};

export function categoryStyle(categoryId: string): CategoryStyle {
  return STYLES[categoryId] ?? FALLBACK;
}
