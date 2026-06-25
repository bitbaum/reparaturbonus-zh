'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck, Leaf, ShieldCheck } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { REPAIR_CATEGORIES } from '@/lib/constants/repair-categories'

interface HeroProps {
  onStart: () => void
}

/**
 * Quiet, official hero for a government repair-subsidy service. The CHF 100
 * bonus and the three eligible categories are the visual anchor; restraint
 * (no gradients, no blobs) reads as trustworthy to a civic audience.
 */
export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: message + CTA */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-brand-soft text-brand-strong text-sm font-medium mb-6">
              <BadgeCheck className="h-4 w-4" />
              Eine Initiative der Stadt Zürich
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text mb-5 leading-tight">
              Reparieren statt entsorgen –<br />
              <span className="text-brand">mit bis zu CHF 100 Bonus</span>
            </h1>

            <p className="text-lg text-text-muted max-w-xl mb-8 leading-relaxed">
              Kaputtes Gerät, ein Loch in der Kleidung oder abgenutzte Schuhe?
              Finden Sie eine zertifizierte Werkstatt in der Stadt Zürich und
              erhalten Sie bis zu 100 Franken an Ihre Reparatur.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 bg-action text-on-brand px-7 py-3.5 rounded-btn font-semibold text-lg hover:bg-action-strong transition-colors shadow-card group"
              >
                Reparatur starten
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href={ROUTES.SHOPS}
                className="inline-flex items-center justify-center bg-surface text-text px-7 py-3.5 rounded-btn font-semibold text-lg border border-border hover:bg-surface-alt transition-colors"
              >
                Alle Werkstätten
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-muted">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-action" />
                Bis zu 50% günstiger
              </span>
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-4 w-4 text-eco" />
                Schont Ressourcen
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Geprüfte Werkstätten
              </span>
            </div>
          </div>

          {/* Right: the three eligible categories as the anchor */}
          <div className="bg-bg border border-border rounded-card p-6 sm:p-8 shadow-card">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-5">
              Bonusberechtigt sind
            </p>
            <ul className="space-y-3">
              {REPAIR_CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <li
                    key={category.id}
                    className="flex items-center gap-4 bg-surface border border-border rounded-btn px-4 py-3"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-brand-soft text-brand shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-text">{category.label}</span>
                      <span className="block text-sm text-text-muted truncate">
                        {category.examples.slice(0, 3).join(', ')}
                      </span>
                    </span>
                    <span className="ml-auto text-sm font-semibold text-action whitespace-nowrap">
                      CHF 100
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="text-xs text-text-muted mt-5 leading-relaxed">
              Der Bonus deckt bis zu 50% der Reparaturkosten, maximal CHF 100.
              Reparatur in der Schweiz, Abgabestelle in der Stadt Zürich.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
