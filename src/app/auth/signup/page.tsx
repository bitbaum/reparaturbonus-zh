'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import {
  AuthShell,
  AuthField,
  AuthPasswordField,
  AuthError,
  AuthSubmitButton,
} from '@/components/auth/AuthShell';

const BENEFITS = [
  'CHF 100 Reparaturbonus pro Person und Jahr',
  'Annahme der Reparaturen in der Stadt Zürich',
  'Einfache Online-Verwaltung',
  'Direktabzug von der Rechnung',
];

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'private' as 'private' | 'workshop',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectingToShop, setRedirectingToShop] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        }),
      });

      if (res.ok) {
        router.push('/auth/signin?message=Konto erfolgreich erstellt');
      } else {
        const data = await res.json();
        setError(data.message || 'Ein Fehler ist aufgetreten');
      }
    } catch {
      setError('Ein Fehler ist bei der Registrierung aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      marketing={<SignUpMarketing />}
      title="Konto erstellen"
      subtitle="Eröffnen Sie jetzt ein Konto"
      switchPrompt="Bereits ein Konto?"
      switchHref="/auth/signin"
      switchLabel="Jetzt anmelden"
    >
      {/* User Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Ich bin...</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
              formData.userType === 'private'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFormData({ ...formData, userType: 'private' })}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Privatperson</span>
          </button>
          <button
            type="button"
            disabled={redirectingToShop}
            className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
              redirectingToShop
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={async () => {
              setRedirectingToShop(true);
              // Small delay for better UX
              setTimeout(() => {
                router.push('/shop-onboarding');
              }, 300);
            }}
          >
            {redirectingToShop ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
                <span className="text-sm font-medium">Weiterleitung...</span>
              </>
            ) : (
              <>
                <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Reparaturbetrieb</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField
          id="name"
          label={formData.userType === 'workshop' ? 'Name des Betriebs' : 'Vollständiger Name'}
          placeholder={
            formData.userType === 'workshop'
              ? 'Name Ihres Reparaturbetriebs'
              : 'Ihr vollständiger Name'
          }
          className="sm:py-4"
          value={formData.name}
          onChange={handleChange}
        />

        <AuthField
          id="email"
          type="email"
          autoComplete="email"
          label="E-Mail-Adresse"
          placeholder="ihre.email@beispiel.com"
          className="sm:py-4"
          value={formData.email}
          onChange={handleChange}
        />

        <AuthPasswordField
          id="password"
          autoComplete="new-password"
          label="Passwort"
          placeholder="Mindestens 6 Zeichen"
          value={formData.password}
          onChange={handleChange}
        />

        <AuthPasswordField
          id="confirmPassword"
          autoComplete="new-password"
          label="Passwort bestätigen"
          placeholder="Passwort wiederholen"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <AuthError message={error} />

        <AuthSubmitButton loading={loading} pendingLabel="Konto wird erstellt...">
          Konto erstellen
        </AuthSubmitButton>
      </form>
    </AuthShell>
  );
}

function SignUpMarketing() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
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
