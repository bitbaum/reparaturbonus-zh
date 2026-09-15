'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  AuthShell,
  AuthField,
  AuthPasswordField,
  AuthError,
  AuthSubmitButton,
} from '@/components/auth/AuthShell';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Ungültige Anmeldedaten');
      } else {
        const session = await getSession();
        if (
          (session?.user as { role?: string })?.role === 'ADMIN' ||
          (session?.user as { role?: string })?.role === 'SUPER_ADMIN'
        ) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      setError('Ein Fehler ist bei der Anmeldung aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      marketing={<SignInMarketing />}
      title="Anmelden"
      subtitle="Melden Sie sich bei Ihrem Konto an"
      switchPrompt="Noch kein Konto?"
      switchHref="/auth/signup"
      switchLabel="Jetzt registrieren"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          type="email"
          autoComplete="email"
          label="E-Mail-Adresse"
          placeholder="ihre.email@beispiel.com"
          className="sm:py-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthPasswordField
          id="password"
          autoComplete="current-password"
          label="Passwort"
          placeholder="Ihr Passwort"
          className="sm:py-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthError message={error} />

        <AuthSubmitButton loading={loading} pendingLabel="Anmeldung läuft...">
          Anmelden
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

function SignInMarketing() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Willkommen zurück!</h1>
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
