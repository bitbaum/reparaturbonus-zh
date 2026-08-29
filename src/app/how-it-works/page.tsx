'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'private' | 'workshop'>('private');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wie funktioniert der Reparaturbonus?
          </h1>
          <p className="text-xl text-gray-600">
            Einfach, schnell und nachhaltig zu Ihrem Reparaturbonus
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200 grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('private')}
              className={`flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 min-w-[160px] ${
                activeTab === 'private'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <UserIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Für Privatpersonen</span>
            </button>
            <button
              onClick={() => setActiveTab('workshop')}
              className={`flex items-center justify-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 min-w-[160px] ${
                activeTab === 'workshop'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <BuildingStorefrontIcon className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Für Reparaturbetriebe</span>
            </button>
          </div>
        </div>

        {/* Content for Private Persons */}
        {activeTab === 'private' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Registrieren und Reparaturbonus generieren
                </h3>
                <p className="text-gray-600">
                  Registrieren Sie sich hier auf der Plattform und erstellen Sie einen
                  Reparaturbonus.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Reparaturbetrieb finden</h3>
                <p className="text-gray-600">
                  Suchen Sie mit den Angaben zu Ihrem defekten Gegenstand und ihrer Adresse auf der
                  Plattform einen passenden Repraturbetrieb in Ihrer Nähe.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Reparatur durchführen und Bonus abrechnen
                </h3>
                <p className="text-gray-600">
                  Bringen Sie Ihren defekten Artikel zum Reparaturbetrieb und lassen die Reparatur
                  ausführen. Nach Abschluss der Reparatur bezahlen Sie 50% bzw. maximal 100 Franken
                  weniger als den Preis der Reparatur.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                Voraussetzungen für Privatpersonen
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">✓ Berechtigung</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Wohnsitz in der Stadt Zürich</li>
                    <li>• Persönlicher Bonus-Code generiert</li>
                    <li>• Reparatur bei teilnehmendem Betrieb</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">💰 Bonus-Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• CHF 100 werden reserviert</li>
                    <li>• Gültig für 30 Tage</li>
                    <li>• Direktabzug von der Rechnung</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Bereit für Ihre Reparatur?</h2>
              <p className="text-blue-100 mb-6">
                Finden Sie jetzt einen teilnehmenden Reparaturbetrieb in Ihrer Nähe und nutzen Sie
                Ihren CHF 100 Reparaturbonus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Konto erstellen und Bonus generieren
                </Link>
                <Link
                  href="/shops"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Reparaturbetriebe finden
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Content for Workshops */}
        {activeTab === 'workshop' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Registrierung</h3>
                <p className="text-gray-600">
                  Melden Sie Ihren Reparaturbetrieb für das Reparaturbonus-Programm an.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Reparaturen durchführen</h3>
                <p className="text-gray-600">
                  Bieten Sie Reparaturdienstleistungen für Kund*innen an.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Abrechnung</h3>
                <p className="text-gray-600">
                  Rechnen Sie den Reparaturbonus direkt mit ERZ Stadt Zürich ab.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-600">
                Voraussetzungen für Reparaturbetriebe
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">🏪 Betrieb</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Annahmestelle in der Stadt Zürich</li>
                    <li>• Open-House-Vertrag mit ERZ</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">💼 Abwicklung</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Bonus-Code Verifikation</li>
                    <li>• Wohnsitznachweis prüfen</li>
                    <li>• Monatliche Abrechnung mit ERZ</li>
                    <li>• Dokumentation der Reparaturen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Vorteile für Ihr Unternehmen</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">💰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Neue Kund*innen</h3>
                  <p className="text-gray-600 text-sm">
                    Erreichen Sie neue Kund*innen durch das Reparaturbonus-Programm
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">🌱</span>
                  </div>
                  <h3 className="font-semibold mb-2">Nachhaltigkeit</h3>
                  <p className="text-gray-600 text-sm">
                    Unterstützen Sie die Kreislaufwirtschaft und Nachhaltigkeit
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">📈</span>
                  </div>
                  <h3 className="font-semibold mb-2">Einkommen sichern</h3>
                  <p className="text-gray-600 text-sm">
                    Sichern Sie durch kostendeckende Reparaturen den Weiterbestand Ihres
                    Betriebs{' '}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Werden Sie Partner*in!</h2>
              <p className="text-green-100 mb-6">
                Registrieren Sie Ihren Reparaturbetrieb und nehmen Sie teil am
                Reparaturbonus-Programm der Stadt Zürich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center"
                >
                  Betrieb registrieren
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Mehr Informationen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
