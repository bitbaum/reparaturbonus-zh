'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Shop } from '@/types/shop';
import { getShop, calculateAverageRating } from '@/lib/demo/shopData';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { ShopTabs } from '@/components/shop/ShopTabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ShopProfilePage() {
  const params = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API first
        const response = await fetch(`/api/shops/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setShop(data);
        } else {
          // Fallback to demo data with navigation fix
          const demoShop = getShop(params.id as string);
          if (demoShop) {
            setShop(demoShop);
          } else {
            setError('Diese Werkstatt konnte nicht gefunden werden.');
          }
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
        // Try demo data as final fallback
        const demoShop = getShop(params.id as string);
        if (demoShop) {
          setShop(demoShop);
        } else {
          setError('Fehler beim Laden der Werkstatt-Daten.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Werkstatt-Details werden geladen..." />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Werkstatt nicht gefunden'}
          </h1>
          <p className="text-gray-600 mb-8">
            Die angeforderte Werkstatt existiert nicht oder ist temporär nicht verfügbar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shops"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Zurück zur Übersicht
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Nochmals versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(shop.reviews);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/shops"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Zurück zu Werkstätten</span>
              <span className="sm:hidden">Zurück</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <ShareIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Teilen</span>
              </button>
              <button className="flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <HeartIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Merken</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Header Component */}
      <ShopHeader shop={shop} averageRating={averageRating} />

      {/* Content Tabs Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <ShopTabs shop={shop} averageRating={averageRating} />
      </div>
    </div>
  );
}
