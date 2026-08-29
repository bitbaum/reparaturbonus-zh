import Link from 'next/link';
import { ArrowRight, FileText, PencilLine, Store } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

const STEPS = [
  {
    icon: FileText,
    title: 'Reparaturbonus erstellen',
    text: 'Melden Sie sich an und generieren Sie Ihren persönlichen Reparaturbonus.',
  },
  {
    icon: PencilLine,
    title: 'Reparatur beschreiben',
    text: 'Wählen Sie die Kategorie und beschreiben Sie, was repariert werden soll.',
  },
  {
    icon: Store,
    title: 'Werkstatt auswählen',
    text: 'Lassen Sie sich passende Werkstätten in Ihrer Nähe anzeigen und bringen Sie Ihren Gegenstand vorbei.',
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text mb-3">So einfach funktioniert&apos;s</h2>
        <p className="text-xl text-text-muted">In 3 Schritten zu Ihrer Reparatur mit Bonus</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="bg-surface border border-border rounded-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-text-muted">Schritt {index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{step.title}</h3>
              <p className="text-text-muted leading-relaxed">{step.text}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          href={ROUTES.HOW_IT_WORKS}
          className="inline-flex items-center text-brand hover:text-brand-strong font-medium transition-colors"
        >
          Detaillierte Anleitung ansehen
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </section>
  );
}
