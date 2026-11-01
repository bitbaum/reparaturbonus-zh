import { CheckCircleIcon } from '@heroicons/react/24/outline';

/** The left column of the auth pages: what the programme offers. */

const BENEFITS = [
  'CHF 100 Reparaturbonus pro Person und Jahr',
  'Annahme der Reparaturen in der Stadt Zürich',
  'Einfache Online-Verwaltung',
  'Direktabzug von der Rechnung',
];

export function SignInMarketing() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Willkommen zurück!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Verwalten Sie Ihren Reparaturbonus und entdecken Sie neue Reparaturmöglichkeiten.
      </p>

      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-blue-600 text-xl">📱</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Verwalten Sie Ihre Reparaturen</h3>
            <p className="text-gray-600 text-sm">
              Behalten Sie den Überblick über alle Ihre Reparaturen.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-purple-600 text-xl">💰</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Reparaturbonus generieren</h3>
            <p className="text-gray-600 text-sm">
              Generieren Sie einen neuen Reparaturbonus für eine aktuell anstehende Reparatur
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-green-600 text-xl">🔧</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Neue Reparaturbetriebe entdecken</h3>
            <p className="text-gray-600 text-sm">
              Finden Sie passende Reparaturbetriebe in Ihrer Nähe und lesen Sie Bewertungen.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">🌱 Gut für die Umwelt</h3>
        <p className="text-gray-700 text-sm">
          Jede Reparatur hilft dabei, CO<sub>2</sub>-Emissionen zu verringern und wertvolle
          Ressourcen zu schonen.
        </p>
      </div>
    </>
  );
}

export function SignUpMarketing() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Reparaturförderung in Zürich
        <br />
        Machen Sie mit!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Melden Sie sich beim Reparaturbonus-Programm an und helfen Sie dabei, unsere Umwelt zu
        schützen.
      </p>

      <div className="space-y-4 mb-8">
        {BENEFITS.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Wussten Sie schon?</h3>
        <p className="text-gray-700 text-sm">
          Die Stadt Zürich fördert Reparaturen von Elektro- und Elektronikgeräten, Kleidern und
          Schuhen mit einem 3-jährigen Pilotprojekt ab 2026.
        </p>
      </div>
    </>
  );
}
