'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, GiftIcon, CameraIcon, WrenchScrewdriverIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon, CurrencyDollarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { ROUTES } from '@/lib/constants/routes'
import { SHOP_CATEGORIES, CATEGORY_LABELS } from '@/lib/constants/categories'

// Use existing category constants instead of hardcoded values
const REPAIR_CATEGORIES = [
  { 
    id: SHOP_CATEGORIES.ELECTRONICS, 
    label: CATEGORY_LABELS.ELECTRONICS, 
    icon: '📱', 
    examples: ['Smartphone', 'Laptop', 'Tablet', 'Kopfhörer', 'Kaffeemaschine', 'Toaster'] 
  },
  { 
    id: SHOP_CATEGORIES.CLOTHING, 
    label: CATEGORY_LABELS.CLOTHING, 
    icon: '👕', 
    examples: ['Jacke', 'Hose', 'T-Shirt', 'Tasche'] 
  },
  { 
    id: SHOP_CATEGORIES.SHOES, 
    label: CATEGORY_LABELS.SHOES, 
    icon: '👟', 
    examples: ['Sneaker', 'Stiefel', 'Sandalen', 'Absätze'] 
  }
]

export default function Home() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [step, setStep] = useState(0) // 0 = hero, 1 = categories, 2 = details
  const [showWorkshopInfo, setShowWorkshopInfo] = useState(false)

  const handleGetStarted = () => {
    setStep(1)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep(2)
  }

  const handleSubmitRepair = () => {
    // Use Next.js router instead of direct window.location for SPA navigation
    const params = new URLSearchParams({
      category: selectedCategory,
      search: itemDescription,
      ...(problemDescription && { problem: problemDescription })
    })
    router.push(`${ROUTES.SHOPS}?${params.toString()}`)
  }

  const handleSkipToShops = () => {
    router.push(ROUTES.SHOPS)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Step 0: Hero Section */}
      {step === 0 && (
        <>
          {/* Main Hero */}
          <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
              <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
                  <GiftIcon className="h-4 w-4 mr-2" />
                  CHF 100 Reparaturbonus der Stadt
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  <span className="text-indigo-600">Reparieren</span> statt
                  <span className="block">Entsorgen</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Kaputtes Gerät, Loch in Kleid oder Schuh?<br />Finden Sie die passende Werkstatt in Zürich
                  und nutzen Sie mit bis zu 100 Franken den Reparaturbonus der Stadt.
                </p>

                {/* Value Props */}
                <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-sm">
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Bis zu 50% Ermässigung</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <SparklesIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Umweltfreundlich</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span>Zuverlässige Werkstätten</span>
                  </div>
                </div>

                {/* Main CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    onClick={handleGetStarted}
                    className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
                  >
                    Reparatur starten
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={handleSkipToShops}
                    className="flex-1 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                  >
                    Alle Werkstätten
                  </button>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
            </div>
          </section>

        </>
      )}

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-4">
              Schritt 1 von 2
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Was möchten Sie reparieren?
            </h2>
            <p className="text-lg text-gray-600">
              Wählen Sie die passende Kategorie für Ihren Gegenstand
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {REPAIR_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-center group"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <div className="font-semibold text-gray-900 mb-2">{category.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-indigo-600">
                    {category.examples.slice(0, 2).join(', ')}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Oder schauen Sie sich direkt alle Werkstätten an
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep(0)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <Link
                  href={ROUTES.SHOPS}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Alle Werkstätten durchsuchen
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Item Details */}
      {step === 2 && selectedCategory && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-4">
              Schritt 2 von 2 • Optional
            </div>
            <div className="text-4xl mb-4">
              {REPAIR_CATEGORIES.find(cat => cat.id === selectedCategory)?.icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Erzählen Sie uns mehr
            </h2>
            <p className="text-lg text-gray-600">
              Je mehr Details Sie angeben, desto bessere Empfehlungen erhalten Sie
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was genau möchten Sie reparieren?
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder={`z.B. ${REPAIR_CATEGORIES.find(cat => cat.id === selectedCategory)?.examples.join(', ') || 'Beschreiben Sie Ihren Gegenstand'}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was ist das Problem? 
                  <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="z.B. Display ist gesprungen, Reissverschluss klemmt, macht komische Geräusche... Oder lassen Sie uns das Problem für Sie analysieren!"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Kein Problem, wenn Sie das nicht wissen - wir helfen Ihnen bei der Analyse!
                </p>
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CameraIcon className="h-4 w-4 inline mr-1" />
                  Foto hinzufügen (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <CameraIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Foto hochladen oder hier klicken
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hilft der Werkstatt, das Problem besser zu verstehen
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSubmitRepair}
                disabled={!itemDescription.trim()}
                className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center group"
              >
                🔍 Passende Werkstätten finden
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  onClick={handleSkipToShops}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Direkt zu Werkstätten
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section - Only show on hero */}
      {step === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">So einfach funktioniert&apos;s</h2>
            <p className="text-xl text-gray-600">In 3 Schritten zu Ihrer Reparatur mit Bonus</p>
          </div>
            
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reparaturbonus erstellen</h3>
              <p className="text-gray-600">
                Melden Sie sich hier an und Generieren Sie ihren Reparaturbonus
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reparatur beschreiben</h3>
              <p className="text-gray-600">
                Wählen Sie die Kategorie und beschreiben Sie, was repariert werden soll
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Werkstatt auswählen</h3>
              <p className="text-gray-600">
                Lassen Sie sich passende Werkstätten in Ihrer Nähe anzeigen und bringen ihren Gegenstand in die ausgewählte Werkstatt
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href={ROUTES.HOW_IT_WORKS}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              Detaillierte Anleitung ansehen
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </section>
      )}

      {/* Environmental Impact Section - Only show on hero */}
      {step === 0 && (
        <section className="bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Reparieren statt entsorgen
              </h2>
              <p className="text-xl text-gray-600">Gut für Ihren Geldbeutel und die Umwelt</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bis zu 50% sparen</h3>
                <p className="text-gray-600">
                  Durch den Reparaturbonus kostet die Reparatur bis zu 50% (maximal 100 Franken) weniger
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CO<sub>2</sub> reduzieren</h3>
                <p className="text-gray-600">
                  Reparaturen sparen gegenüber einem Neukauf Treibhausgas-Emissionen
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">♻️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Abfall vermeiden</h3>
                <p className="text-gray-600">
                  Ressourcen schonen dank längerer Nutzung der Gegenstände
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workshop Recruitment Section - Only show on hero */}
      {step === 0 && (
        <section className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Sind Sie eine Reparaturwerkstatt?
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Werden Sie Teil des Reparatur-Netzwerks und helfen Sie dabei, 
                  Zürich nachhaltiger zu machen, erreichen Sie neue Kund*innen
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={ROUTES.SHOP_ONBOARDING}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                  >
                    <BuildingStorefrontIcon className="h-6 w-6 mr-3" />
                    Jetzt kostenlos anmelden
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button 
                    onClick={() => setShowWorkshopInfo(!showWorkshopInfo)}
                    className="inline-flex items-center justify-center border-2 border-slate-400 text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 hover:border-slate-300 transition-all duration-200"
                  >
                    <WrenchScrewdriverIcon className="h-6 w-6 mr-3" />
                    {showWorkshopInfo ? 'Weniger anzeigen' : 'Mehr erfahren'}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-semibold text-white mb-8">Schnelle Anmeldung</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Grunddaten eingeben</h4>
                        <p className="text-slate-300 text-sm">alle Pflicht-Formularfelder ausfüllen</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Leistungen auswählen</h4>
                        <p className="text-slate-300 text-sm">Spezialisierungen und Dienstleistungen angeben</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Prüfung & Freischaltung</h4>
                        <p className="text-slate-300 text-sm">Qualitätsprüfung dauert 2-3 Werktage</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">Kund*innen erhalten</h4>
                        <p className="text-slate-300 text-sm">Sofort sichtbar für Reparatur-Suchende</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Expandable Workshop Information */}
      {step === 0 && showWorkshopInfo && (
        <section className="bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Was bietet das Reparatur-Netzwerk?</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Zielgruppe erreichen</h4>
                        <p className="text-slate-300">Kund*innen, die bewusst reparieren statt neu kaufen möchten</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">💰</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">CHF 100 Bonus-System</h4>
                        <p className="text-slate-300">Kund*innen erhalten Bonus für Reparaturen - mehr Motivation zu reparieren</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">📱</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Moderne Plattform</h4>
                        <p className="text-slate-300">Benutzerfreundliche Online-Präsenz für bessere Auffindbarkeit</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Voraussetzungen</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">In der Stadt</h4>
                        <p className="text-slate-300">Abgabestelle in der Stadt Zürich</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Reparatur in der Schweiz</h4>
                        <p className="text-slate-300">Reparaturen müssen in der Schweiz durchgeführt werden</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Qualitätsstandards</h4>
                        <p className="text-slate-300">Nachvollziehbare Preisen und verlässliche Servicequalität</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white mb-4">Bereit loszulegen?</h3>
                  <p className="text-slate-300 mb-8 text-lg">Die Anmeldung dauert nur wenige Minuten und ist kostenlos.</p>
                  <Link
                    href={ROUTES.SHOP_ONBOARDING}
                    className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <BuildingStorefrontIcon className="h-6 w-6 mr-3" />
                    Jetzt anmelden
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse Workshops CTA - Only show on hero */}
      {step === 0 && (
        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Oder durchsuchen Sie alle Werkstätten
              </h2>
              <p className="text-gray-600 mb-6">
                Entdecken Sie alle beteiligten Reparaturwerkstätten in Zürich
              </p>
              <Link
                href={ROUTES.SHOPS}
                className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-indigo-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Alle Werkstätten anzeigen
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}