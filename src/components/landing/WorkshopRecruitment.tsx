'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Wrench,
  Store,
  CheckCircle2,
  Target,
  Coins,
  MonitorSmartphone,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

const ONBOARDING_STEPS = [
  { title: 'Grunddaten eingeben', text: 'Alle Pflicht-Formularfelder ausfüllen' },
  { title: 'Leistungen auswählen', text: 'Spezialisierungen und Dienstleistungen angeben' },
  { title: 'Prüfung & Freischaltung', text: 'Qualitätsprüfung dauert 2–3 Werktage' },
  { title: 'Kund*innen erhalten', text: 'Sofort sichtbar für Reparatur-Suchende' },
] as const

const BENEFITS = [
  {
    icon: Target,
    title: 'Zielgruppe erreichen',
    text: 'Kund*innen, die bewusst reparieren statt neu kaufen möchten',
  },
  {
    icon: Coins,
    title: 'CHF 100 Bonus-System',
    text: 'Kund*innen erhalten Bonus für Reparaturen – mehr Motivation zu reparieren',
  },
  {
    icon: MonitorSmartphone,
    title: 'Moderne Plattform',
    text: 'Benutzerfreundliche Online-Präsenz für bessere Auffindbarkeit',
  },
] as const

const REQUIREMENTS = [
  { title: 'In der Stadt', text: 'Abgabestelle in der Stadt Zürich' },
  { title: 'Reparatur in der Schweiz', text: 'Reparaturen müssen in der Schweiz durchgeführt werden' },
  { title: 'Qualitätsstandards', text: 'Nachvollziehbare Preise und verlässliche Servicequalität' },
] as const

export default function WorkshopRecruitment() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <section className="bg-brand-strong text-on-brand">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Sind Sie eine Reparaturwerkstatt?</h2>
              <p className="text-xl text-on-brand/80 mb-8 leading-relaxed">
                Werden Sie Teil des Reparatur-Netzwerks, helfen Sie mit, Zürich nachhaltiger zu
                machen, und erreichen Sie neue Kund*innen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={ROUTES.SHOP_ONBOARDING}
                  className="inline-flex items-center justify-center bg-action text-on-brand px-8 py-4 rounded-btn font-semibold text-lg hover:bg-action-strong transition-colors shadow-card group"
                >
                  <Store className="h-6 w-6 mr-3" />
                  Jetzt kostenlos anmelden
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="inline-flex items-center justify-center border border-on-brand/40 text-on-brand px-8 py-4 rounded-btn font-semibold text-lg hover:bg-on-brand/10 transition-colors"
                >
                  <Wrench className="h-6 w-6 mr-3" />
                  {showInfo ? 'Weniger anzeigen' : 'Mehr erfahren'}
                </button>
              </div>
            </div>

            <div className="bg-on-brand/5 rounded-card p-8 border border-on-brand/10">
              <h3 className="text-2xl font-semibold mb-8">Schnelle Anmeldung</h3>
              <ol className="space-y-6">
                {ONBOARDING_STEPS.map((step, index) => (
                  <li key={step.title} className="flex items-start">
                    <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-action text-on-brand font-bold text-sm mr-4 shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium mb-1">{step.title}</h4>
                      <p className="text-on-brand/70 text-sm">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {showInfo && (
        <section className="bg-brand-strong">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-on-brand/5 rounded-card p-8 border border-on-brand/10 text-on-brand">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Was bietet das Reparatur-Netzwerk?</h3>
                  <div className="space-y-6">
                    {BENEFITS.map((benefit) => {
                      const Icon = benefit.icon
                      return (
                        <div key={benefit.title} className="flex items-start">
                          <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-action/20 text-action mr-4 shrink-0">
                            <Icon className="h-6 w-6" />
                          </span>
                          <div>
                            <h4 className="font-semibold mb-1">{benefit.title}</h4>
                            <p className="text-on-brand/70">{benefit.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-6">Voraussetzungen</h3>
                  <div className="space-y-6">
                    {REQUIREMENTS.map((req) => (
                      <div key={req.title} className="flex items-start">
                        <CheckCircle2 className="h-6 w-6 text-eco mr-4 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">{req.title}</h4>
                          <p className="text-on-brand/70">{req.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-on-brand/20 text-center">
                <h3 className="text-2xl font-semibold mb-3">Bereit loszulegen?</h3>
                <p className="text-on-brand/70 mb-8 text-lg">
                  Die Anmeldung dauert nur wenige Minuten und ist kostenlos.
                </p>
                <Link
                  href={ROUTES.SHOP_ONBOARDING}
                  className="inline-flex items-center bg-action text-on-brand px-8 py-4 rounded-btn font-semibold text-lg hover:bg-action-strong transition-colors shadow-card"
                >
                  <Store className="h-6 w-6 mr-3" />
                  Jetzt anmelden
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
