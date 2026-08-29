'use client';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  GiftIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ROUTES } from '@/lib/constants/routes';

interface BonusCode {
  id: string;
  code: string;
  amount: number;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
  usedAt: string | null;
  shop: {
    name: string;
  } | null;
  order: {
    id: string;
    total: number;
    status: string;
  } | null;
}

export default function Dashboard() {
  // Add error handling for session provider
  let session = null;
  let status = 'unauthenticated';
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch {
    console.log('Session provider not available in dashboard');
  }

  const router = useRouter();
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchBonusCodes();
  }, [session, status, router]);

  const fetchBonusCodes = async () => {
    try {
      const response = await fetch('/api/bonus-codes');
      if (response.ok) {
        const data = await response.json();
        setBonusCodes(data);
      }
    } catch (error) {
      console.error('Error fetching bonus codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const getStatusColor = (isUsed: boolean, expiresAt: string) => {
    if (isUsed) return 'bg-green-100 text-green-800';
    if (new Date() > new Date(expiresAt)) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (isUsed: boolean, expiresAt: string) => {
    if (isUsed) return 'Verwendet';
    if (new Date() > new Date(expiresAt)) return 'Abgelaufen';
    return 'Aktiv';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Dashboard wird geladen..." />
      </div>
    );
  }

  const activeBonusCodes = bonusCodes.filter(
    (code) => !code.isUsed && new Date() < new Date(code.expiresAt),
  );
  const totalActiveValue = activeBonusCodes.reduce((sum, code) => sum + code.amount, 0);

  return (
    <div className="bg-gray-50">
      <PageHeader title="Ihr Dashboard" subtitle={`Willkommen zurück, ${session?.user?.name}! 👋`}>
        <button
          onClick={() => router.push(ROUTES.SHOPS)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Werkstätten finden
        </button>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GiftIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aktiver Bonus-Wert
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalActiveValue)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Aktive Codes</dt>
                    <dd className="text-lg font-medium text-gray-900">{activeBonusCodes.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Codes insgesamt</dt>
                    <dd className="text-lg font-medium text-gray-900">{bonusCodes.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Codes */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Ihre Bonus-Codes</h3>

            {bonusCodes.length === 0 ? (
              <div className="text-center py-12">
                <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Noch keine Bonus-Codes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Beginnen Sie, indem Sie eine Reparaturwerkstatt besuchen und eine Reparatur
                  durchführen lassen.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/shops')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <ShoppingBagIcon className="-ml-1 mr-2 h-5 w-5" />
                    Reparaturwerkstätten finden
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bonusCodes.map((bonusCode) => (
                  <div key={bonusCode.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 rounded-lg p-2">
                          <GiftIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{bonusCode.code}</h4>
                          <p className="text-sm text-gray-500">
                            {bonusCode.shop?.name || 'Unknown Shop'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium text-gray-900">
                          {formatCurrency(bonusCode.amount)}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bonusCode.isUsed, bonusCode.expiresAt)}`}
                        >
                          {getStatusText(bonusCode.isUsed, bonusCode.expiresAt)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Erstellt: {formatDate(bonusCode.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Läuft ab: {formatDate(bonusCode.expiresAt)}
                      </div>
                      {bonusCode.usedAt && (
                        <div className="flex items-center col-span-2">
                          <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                          Verwendet: {formatDate(bonusCode.usedAt)}
                        </div>
                      )}
                    </div>

                    {bonusCode.order && (
                      <div className="mt-2 text-sm text-gray-500">
                        Bestellsumme: {formatCurrency(bonusCode.order.total)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
