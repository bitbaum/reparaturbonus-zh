'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  UserIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const benefits = [
    'CHF 100 Reparaturbonus pro Person und Jahr',
    'Annahme der Reparaturen in der Stadt Zürich',
    'Einfache Online-Verwaltung',
    'Direktabzug von der Rechnung',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Marketing Content */}
          <div className="order-2 lg:order-1">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Reparaturförderung in Zürich
                <br />
                Machen Sie mit!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Melden Sie sich beim Reparaturbonus-Programm an und helfen Sie dabei, unsere Umwelt
                zu schützen.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Wussten Sie schon?</h3>
                <p className="text-gray-700 text-sm">
                  Die Stadt Zürich fördert Reparaturen von Elektro- und Elektronikgeräten, Kleidern
                  und Schuhen mit einem 3-jährigen Pilotprojekt ab 2026.
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Konto erstellen</h2>
                <p className="text-gray-600">Eröffnen Sie jetzt ein Konto</p>
              </div>

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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.userType === 'workshop' ? 'Name des Betriebs' : 'Vollständiger Name'}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder={
                      formData.userType === 'workshop'
                        ? 'Name Ihres Reparaturbetriebs'
                        : 'Ihr vollständiger Name'
                    }
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail-Adresse
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="ihre.email@beispiel.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Mindestens 6 Zeichen"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Passwort wiederholen"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Konto wird erstellt...
                    </div>
                  ) : (
                    'Konto erstellen'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Bereits ein Konto?{' '}
                  <Link
                    href="/auth/signin"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Jetzt anmelden
                  </Link>
                </p>
              </div>
            </div>

            {/* Return to homepage link */}
            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
