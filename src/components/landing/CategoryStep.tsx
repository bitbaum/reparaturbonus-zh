'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { REPAIR_CATEGORIES } from '@/lib/constants/repair-categories'

interface CategoryStepProps {
  onSelect: (categoryId: string) => void
  onBack: () => void
}

/** Wizard step 1: choose the repair category. */
export default function CategoryStep({ onSelect, onBack }: CategoryStepProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1.5 rounded-pill bg-brand-soft text-brand-strong text-sm font-medium mb-4">
          Schritt 1 von 2
        </div>
        <h2 className="text-3xl font-bold text-text mb-3">Was möchten Sie reparieren?</h2>
        <p className="text-lg text-text-muted">
          Wählen Sie die passende Kategorie für Ihren Gegenstand
        </p>
      </div>

      <div className="bg-surface rounded-card shadow-card border border-border p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {REPAIR_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className="p-6 border border-border rounded-card hover:border-brand hover:bg-brand-soft transition-colors text-center group"
              >
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-btn bg-brand-soft text-brand group-hover:bg-surface">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="font-semibold text-text mb-1">{category.label}</div>
                <div className="text-xs text-text-muted">
                  {category.examples.slice(0, 2).join(', ')}
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center pt-6 border-t border-border">
          <p className="text-text-muted mb-4">Oder schauen Sie sich direkt alle Werkstätten an</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-border text-text rounded-btn hover:bg-surface-alt transition-colors"
            >
              Zurück
            </button>
            <Link
              href={ROUTES.SHOPS}
              className="inline-flex items-center px-6 py-3 bg-surface-alt text-text rounded-btn hover:bg-border transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Alle Werkstätten durchsuchen
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
