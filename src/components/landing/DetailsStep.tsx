'use client';

import { ArrowRight, Camera, Lightbulb, Search } from 'lucide-react';
import { findRepairCategory } from '@/lib/constants/repair-categories';

interface DetailsStepProps {
  categoryId: string;
  itemDescription: string;
  problemDescription: string;
  onItemChange: (value: string) => void;
  onProblemChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onSkip: () => void;
}

/** Wizard step 2: describe the item (optional details before finding shops). */
export default function DetailsStep({
  categoryId,
  itemDescription,
  problemDescription,
  onItemChange,
  onProblemChange,
  onSubmit,
  onBack,
  onSkip,
}: DetailsStepProps) {
  const category = findRepairCategory(categoryId);
  const Icon = category?.icon;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1.5 rounded-pill bg-brand-soft text-brand-strong text-sm font-medium mb-4">
          Schritt 2 von 2 • Optional
        </div>
        {Icon && (
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-brand-soft text-brand">
            <Icon className="h-7 w-7" />
          </span>
        )}
        <h2 className="text-3xl font-bold text-text mb-3">Erzählen Sie uns mehr</h2>
        <p className="text-lg text-text-muted">
          Je mehr Details Sie angeben, desto bessere Empfehlungen erhalten Sie
        </p>
      </div>

      <div className="bg-surface rounded-card shadow-card border border-border p-6 sm:p-8">
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Was genau möchten Sie reparieren?
            </label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => onItemChange(e.target.value)}
              placeholder={`z.B. ${category?.examples.join(', ') || 'Beschreiben Sie Ihren Gegenstand'}...`}
              className="w-full px-4 py-3 border border-border rounded-btn bg-surface text-text focus:ring-2 focus:ring-brand focus:border-brand outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Was ist das Problem? <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => onProblemChange(e.target.value)}
              placeholder="z.B. Display ist gesprungen, Reissverschluss klemmt, macht komische Geräusche..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-btn bg-surface text-text focus:ring-2 focus:ring-brand focus:border-brand outline-none"
            />
            <p className="text-xs text-text-muted mt-2 inline-flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-action" />
              Kein Problem, wenn Sie das nicht wissen – wir helfen Ihnen bei der Analyse!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              <Camera className="h-4 w-4 inline mr-1" />
              Foto hinzufügen (optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-btn p-6 text-center hover:border-brand transition-colors">
              <Camera className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">Foto hochladen oder hier klicken</p>
              <p className="text-xs text-text-muted mt-1">
                Hilft der Werkstatt, das Problem besser zu verstehen
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSubmit}
            disabled={!itemDescription.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-action text-on-brand px-6 py-4 rounded-btn hover:bg-action-strong disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg group"
          >
            <Search className="h-5 w-5" />
            Passende Werkstätten finden
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-border text-text rounded-btn hover:bg-surface-alt transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={onSkip}
              className="flex-1 px-6 py-3 bg-surface-alt text-text rounded-btn hover:bg-border transition-colors"
            >
              Direkt zu Werkstätten
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
