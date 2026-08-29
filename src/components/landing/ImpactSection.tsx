import { Coins, CloudOff, Recycle } from 'lucide-react';

const IMPACTS = [
  {
    icon: Coins,
    title: 'Bis zu 50% sparen',
    text: 'Durch den Reparaturbonus kostet die Reparatur bis zu 50% (maximal 100 Franken) weniger.',
  },
  {
    icon: CloudOff,
    title: 'CO₂ reduzieren',
    text: 'Reparaturen sparen gegenüber einem Neukauf Treibhausgas-Emissionen.',
  },
  {
    icon: Recycle,
    title: 'Abfall vermeiden',
    text: 'Ressourcen schonen dank längerer Nutzung der Gegenstände.',
  },
] as const;

export default function ImpactSection() {
  return (
    <section className="bg-eco-soft border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text mb-3">Reparieren statt entsorgen</h2>
          <p className="text-xl text-text-muted">Gut für Ihren Geldbeutel und die Umwelt</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {IMPACTS.map((impact) => {
            const Icon = impact.icon;
            return (
              <div key={impact.title} className="text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-surface border border-border text-eco">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-semibold text-text mb-2">{impact.title}</h3>
                <p className="text-text-muted leading-relaxed">{impact.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
