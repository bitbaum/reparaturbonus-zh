'use client';

import { useState } from 'react';
import {
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BonusCode {
  id: string;
  code: string;
  amount: number;
  isUsed: boolean;
  expiresAt: string;
  user: {
    name: string;
    email: string;
  };
  shop: {
    name: string;
  };
}

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [bonusCode, setBonusCode] = useState<BonusCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [residenceProof, setResidenceProof] = useState<File | null>(null);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('Bitte geben Sie einen Bonus-Code ein');
      return;
    }

    setLoading(true);
    setError('');
    setBonusCode(null);

    try {
      const response = await fetch(`/api/bonus-codes/${code}?verify=true`);
      if (response.ok) {
        const data = await response.json();
        setBonusCode(data);
        if (data.isUsed) {
          setError('Dieser Bonus-Code wurde bereits verwendet');
        } else if (new Date() > new Date(data.expiresAt)) {
          setError('Dieser Bonus-Code ist abgelaufen');
        }
      } else if (response.status === 404) {
        setError('Bonus-Code nicht gefunden');
      } else {
        setError('Fehler beim Überprüfen des Codes');
      }
    } catch {
      setError('Netzwerkfehler beim Überprüfen des Codes');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCode = async () => {
    if (!bonusCode || !residenceProof) {
      setError('Bitte laden Sie einen Wohnsitznachweis hoch');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('residenceProof', residenceProof);

      const response = await fetch(`/api/bonus-codes/${bonusCode.code}/use`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setVerified(true);
        setBonusCode({ ...bonusCode, isUsed: true });
      } else {
        setError('Fehler beim Einlösen des Codes');
      }
    } catch {
      setError('Netzwerkfehler beim Einlösen des Codes');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const isCodeValid = bonusCode && !bonusCode.isUsed && new Date() < new Date(bonusCode.expiresAt);

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Bonus-Code Überprüfung"
        subtitle="Überprüfen und einlösen Sie Bonus-Codes für Ihre Kunden"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {!verified ? (
            <>
              {/* Code Input */}
              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Bonus-Code eingeben
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="XXXXXXXX"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={8}
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Überprüfen'}
                  </button>
                </div>
              </div>

              {/* QR Code Scanner Option */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <QrCodeIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">oder QR-Code scannen</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  QR-Code Scanner öffnen
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Bonus Code Details */}
              {bonusCode && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Bonus-Code: {bonusCode.code}
                      </h3>
                      <p className="text-sm text-gray-500">Kunde: {bonusCode.user.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900">
                        {formatCurrency(bonusCode.amount)}
                      </div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isCodeValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCodeValid ? 'Gültig' : bonusCode.isUsed ? 'Verwendet' : 'Abgelaufen'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Gültig bis: {formatDate(bonusCode.expiresAt)}</div>
                    <div>Werkstatt: {bonusCode.shop.name}</div>
                  </div>

                  {/* Residence Proof Upload */}
                  {isCodeValid && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <label
                        htmlFor="residenceProof"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Wohnsitznachweis hochladen (erforderlich)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="residenceProof"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <DocumentIcon className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Klicken zum Hochladen</span> oder
                              Datei hierher ziehen
                            </p>
                            <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <input
                            id="residenceProof"
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setResidenceProof(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {residenceProof && (
                        <p className="mt-2 text-sm text-gray-600">
                          Datei ausgewählt: {residenceProof.name}
                        </p>
                      )}

                      <button
                        onClick={handleUseCode}
                        disabled={loading || !residenceProof}
                        className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          `Bonus einlösen (${formatCurrency(bonusCode.amount)})`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Bonus erfolgreich eingelöst!
              </h2>
              <p className="text-gray-600 mb-4">
                Der Rabatt von {bonusCode && formatCurrency(bonusCode.amount)} wurde vom
                Reparaturbetrag abgezogen.
              </p>
              <button
                onClick={() => {
                  setCode('');
                  setBonusCode(null);
                  setVerified(false);
                  setResidenceProof(null);
                  setError('');
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Neuen Code überprüfen
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Anweisungen für Werkstätten:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Geben Sie den 8-stelligen Bonus-Code ein oder scannen Sie den QR-Code</li>
            <li>2. Überprüfen Sie die Kundendaten und den Bonus-Betrag</li>
            <li>3. Laden Sie einen gültigen Wohnsitznachweis des Kunden hoch</li>
            <li>4. Lösen Sie den Bonus ein und ziehen Sie den Betrag von der Rechnung ab</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
