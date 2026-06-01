function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h2 className="mb-2.5 text-lg font-bold">{title}</h2>
      <p className="text-[15px] text-[#3a4257]">{children}</p>
    </article>
  );
}

export default function InfoCards() {
  return (
    <section className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      <InfoCard title="🎯 O problema">
        Analistas de defesa civil, agronegócio e logística precisam verificar{" "}
        <strong>manualmente</strong>, todos os dias, diversas fontes para saber
        se há incêndios, vulcões ou tempestades acontecendo no mundo. É um
        processo repetitivo, lento e sujeito a erro humano — e atrasos custam
        vidas e prejuízos.
      </InfoCard>
      <InfoCard title="🚀 A solução">
        O SpaceGuard automatiza esse monitoramento usando a{" "}
        <strong>API EONET da NASA</strong>, que rastreia eventos naturais
        detectados por satélites em órbita. O sistema consolida os eventos em um
        único painel e está preparado para{" "}
        <strong>disparar alertas automáticos</strong> — sem intervenção humana.
      </InfoCard>
    </section>
  );
}
