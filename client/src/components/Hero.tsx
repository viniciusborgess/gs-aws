function Badge({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  const base = "rounded-full px-3.5 py-1.5 text-[13px] font-semibold";
  return highlight ? (
    <span className={`${base} bg-gold text-navy`}>{children}</span>
  ) : (
    <span
      className={`${base} border border-white/20 bg-white/10 text-[#e8ecf8]`}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  return (
    <header className="bg-[radial-gradient(1200px_400px_at_80%_-10%,rgba(245,200,76,0.18),transparent),linear-gradient(160deg,#0b1437_0%,#131c4a_100%)] px-5 pb-16 pt-14 text-white">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-center gap-3">
          <span className="text-[40px]">🛰️</span>
          <span className="text-[34px] font-extrabold tracking-tight">
            SpaceGuard
          </span>
        </div>
        <p className="mt-3 max-w-[640px] text-[19px] text-[#c7cfe8]">
          Monitoramento de eventos naturais em tempo real usando dados espaciais
          da NASA.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Badge highlight>ODS 13 · Ação Climática</Badge>
          <Badge>NASA EONET</Badge>
          <Badge>Global Solution 2026 · FIAP</Badge>
        </div>
      </div>
    </header>
  );
}
