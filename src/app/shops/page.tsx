'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  LightBulbIcon,
  BanknotesIcon,
  SparklesIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SHOP_CATEGORIES, CATEGORY_LABELS, type ShopCategory } from '@/lib/constants/categories';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  category: string;
  isActive: boolean;
}

const categories = Object.values(SHOP_CATEGORIES);

// Smart repair capability mapping
const getRepairCapabilities = (item: string, category?: string) => {
  const itemLower = item.toLowerCase();

  // Device/brand mappings
  const deviceMappings = {
    // Smartphones & Electronics
    iphone: ['smartphone', 'handy', 'telefon', 'apple', 'elektronik', 'display', 'akku'],
    samsung: ['smartphone', 'handy', 'telefon', 'android', 'elektronik', 'display'],
    smartphone: ['handy', 'telefon', 'display', 'akku', 'elektronik'],
    handy: ['smartphone', 'telefon', 'display', 'elektronik'],
    laptop: ['computer', 'notebook', 'macbook', 'pc', 'elektronik', 'bildschirm'],
    macbook: ['laptop', 'computer', 'apple', 'notebook', 'elektronik'],
    tablet: ['ipad', 'elektronik', 'display', 'touchscreen'],
    ipad: ['tablet', 'apple', 'elektronik', 'display'],
    kopfhörer: ['headphones', 'audio', 'elektronik', 'kabel'],

    // Clothing & Textiles
    jacke: ['kleidung', 'textil', 'reissverschluss', 'knöpfe', 'nähen'],
    hose: ['kleidung', 'textil', 'nähen', 'änderung'],
    tasche: ['leder', 'reissverschluss', 'griff', 'nähen'],

    // Shoes
    schuhe: ['leder', 'sohle', 'absatz', 'reparatur', 'schuh'],
    sneaker: ['schuhe', 'sohle', 'reparatur', 'sportschuh'],
    stiefel: ['schuhe', 'leder', 'sohle', 'absatz'],
    sandalen: ['schuhe', 'riemen', 'sohle', 'reparatur'],

    // Watches
    uhr: ['uhren', 'batterie', 'armband', 'glas', 'mechanik'],
    armbanduhr: ['uhr', 'uhren', 'batterie', 'armband'],

    // Furniture
    stuhl: ['möbel', 'holz', 'polster', 'reparatur'],
    tisch: ['möbel', 'holz', 'oberfläche'],
    schrank: ['möbel', 'holz', 'türen', 'scharniere'],

    // Bikes
    fahrrad: ['velo', 'rad', 'reifen', 'kette', 'bremsen'],
    'e-bike': ['fahrrad', 'elektro', 'akku', 'motor'],
    velo: ['fahrrad', 'rad', 'reifen', 'kette'],

    // Appliances
    kaffeemaschine: ['haushaltsgeräte', 'elektronik', 'reparatur'],
    toaster: ['haushaltsgeräte', 'elektronik', 'heizung'],
    mixer: ['haushaltsgeräte', 'elektronik', 'motor'],

    // Cars
    auto: ['fahrzeug', 'kfz', 'motor', 'bremsen', 'getriebe', 'karosserie'],
    car: ['auto', 'fahrzeug', 'kfz', 'motor', 'bremsen'],
    pkw: ['auto', 'fahrzeug', 'kfz', 'motor', 'bremsen'],
    motor: ['auto', 'fahrzeug', 'kfz', 'reparatur', 'service'],
    bremsen: ['auto', 'fahrzeug', 'kfz', 'sicherheit', 'reparatur'],
    getriebe: ['auto', 'fahrzeug', 'kfz', 'motor', 'reparatur'],
    karosserie: ['auto', 'fahrzeug', 'kfz', 'blech', 'lackierung'],
    reifen: ['auto', 'fahrzeug', 'kfz', 'räder', 'service'],
    auspuff: ['auto', 'fahrzeug', 'kfz', 'motor', 'abgas'],
    batterie: ['auto', 'fahrzeug', 'kfz', 'elektronik', 'starter'],
    lichtmaschine: ['auto', 'fahrzeug', 'kfz', 'elektronik', 'batterie'],
  };

  // Extract keywords from the item
  const keywords = [];

  // Add direct item keywords
  for (const [key, values] of Object.entries(deviceMappings)) {
    if (itemLower.includes(key)) {
      keywords.push(...values);
      keywords.push(key);
    }
  }

  // Add category-based keywords
  if (category) {
    const categoryKeywords: Record<string, string[]> = {
      electronics: [
        'elektronik',
        'display',
        'akku',
        'reparatur',
        'smartphone',
        'computer',
        'haushaltsgeräte',
        'kaffeemaschine',
        'toaster',
        'mixer',
      ],
      clothing: ['kleidung', 'textil', 'nähen', 'reissverschluss', 'änderung'],
      shoes: ['schuhe', 'leder', 'sohle', 'absatz', 'reparatur', 'schuh'],
    };

    const categoryKey = category.toLowerCase();
    if (categoryKeywords[categoryKey]) {
      keywords.push(...categoryKeywords[categoryKey]);
    }
  }

  // Always include the original item for partial matches
  keywords.push(itemLower);

  return [...new Set(keywords)]; // Remove duplicates
};

const matchesRepairCapability = (shop: Shop, searchItem: string, category?: string) => {
  if (!searchItem.trim()) return true;

  const capabilities = getRepairCapabilities(searchItem, category);
  const shopText = [shop.name, shop.description, shop.category].join(' ').toLowerCase();

  // Check if shop matches any of the repair capabilities
  return capabilities.some((keyword) => shopText.includes(keyword));
};

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [aiSuggestions, setAiSuggestions] = useState<{
    likelyIssues: string[];
    possibleSolutions: string[];
    estimatedRepairCost: { min: number; max: number };
    estimatedNewCost: { min: number; max: number };
    savingsPercentage: number;
    environmentalImpact: { co2Saved: string; wasteAvoided: string };
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get URL parameters for repair submission
  const [repairDetails, setRepairDetails] = useState<{
    category?: string;
    search?: string;
    item?: string;
    problem?: string;
  }>({});

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    const item = urlParams.get('item');
    const problem = urlParams.get('problem');

    if (category || search || item || problem) {
      setRepairDetails({
        category: category || undefined,
        search: search || undefined,
        item: item || undefined,
        problem: problem || undefined,
      });
      if (category && category !== 'ALL') setSelectedCategory(category.toUpperCase());
      if (search) setSearchTerm(search);

      // Fetch AI suggestions for repair details
      if (category && search) {
        fetchAiSuggestions(category, search, problem ?? undefined);
      }
    }

    fetchShops();
  }, []);

  const fetchAiSuggestions = async (category: string, item: string, problem?: string) => {
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, item, problem }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestion);
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      if (response.ok) {
        const data = await response.json();
        setShops(data);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter((shop) => {
    // Use smart repair capability matching for search from repair submission
    const searchToUse = repairDetails.search || searchTerm;
    const categoryToUse =
      repairDetails.category || (selectedCategory !== 'ALL' ? selectedCategory : undefined);

    const matchesSearch = repairDetails.search
      ? matchesRepairCapability(shop, searchToUse, categoryToUse)
      : shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || shop.category === selectedCategory;
    return matchesSearch && matchesCategory && shop.isActive;
  });

  const getCategoryDisplayName = (category: string) => {
    return CATEGORY_LABELS[category as ShopCategory] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      ELECTRONICS: '📱',
      CLOTHING: '👕',
      SHOES: '👟',
    };
    return icons[category] || '🔧';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Werkstätten werden geladen..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Repair Details Banner */}
      {(repairDetails.category || repairDetails.search) && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="text-base sm:text-lg font-semibold">Ihre Reparaturanfrage</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-indigo-100">
                  {repairDetails.search && (
                    <span className="text-xs sm:text-sm">
                      <strong>Gegenstand:</strong> {repairDetails.search}
                    </span>
                  )}
                  {repairDetails.category && (
                    <span className="text-xs sm:text-sm">
                      <strong>Kategorie:</strong> {getCategoryDisplayName(repairDetails.category)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold">CHF 100</div>
                <div className="text-xs sm:text-sm text-indigo-200">Bonus verfügbar</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repair Info Section */}
      {aiSuggestions && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Repair Information */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  <LightBulbIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Reparatur-Informationen
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                      Mögliche Ursachen:
                    </h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      {aiSuggestions.likelyIssues
                        .slice(0, 3)
                        .map((issue: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                      Lösungsansätze:
                    </h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      {aiSuggestions.possibleSolutions
                        .slice(0, 3)
                        .map((solution: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {solution}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cost Savings */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100">
                <div className="flex items-center mb-3 sm:mb-4">
                  <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Ihre Ersparnis
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                      <div className="text-sm sm:text-lg font-bold text-green-600">
                        CHF {aiSuggestions.estimatedRepairCost.min}-
                        {aiSuggestions.estimatedRepairCost.max}
                      </div>
                      <div className="text-xs text-gray-600">Reparaturkosten</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                      <div className="text-sm sm:text-lg font-bold text-red-600">
                        CHF {aiSuggestions.estimatedNewCost.min}-
                        {aiSuggestions.estimatedNewCost.max}
                      </div>
                      <div className="text-xs text-gray-600">Neukauf</div>
                    </div>
                  </div>

                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold">
                      {aiSuggestions.savingsPercentage}% sparen
                    </div>
                    <div className="text-xs sm:text-sm opacity-90">
                      durch Reparatur statt Neukauf
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 flex items-center">
                      <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                      Umwelt-Bonus
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="text-center p-1.5 sm:p-2 bg-blue-50 rounded">
                        <div className="text-xs sm:text-sm font-medium text-blue-600">
                          {aiSuggestions.environmentalImpact.co2Saved}
                        </div>
                        <div className="text-xs text-gray-600">CO2 gespart</div>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-green-50 rounded">
                        <div className="text-xs sm:text-sm font-medium text-green-600">
                          {aiSuggestions.environmentalImpact.wasteAvoided}
                        </div>
                        <div className="text-xs text-gray-600">Abfall vermieden</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {repairDetails.search
                ? `Werkstätten für Ihre ${repairDetails.search}-Reparatur`
                : 'Zugelassene Vertrags-Reparaturwerkstätten in Zürich'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Finden Sie die passende Werkstatt für Ihre Reparatur und erhalten Sie CHF 100 Bonus
            </p>
          </div>

          {/* Modern Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Suchen Sie nach Werkstätten, Leistungen oder Standorten..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors lg:w-auto w-full"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>

            {/* Category Pills - Always Visible on Desktop, Collapsible on Mobile */}
            <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category === 'ALL' ? 'Alle Kategorien' : getCategoryDisplayName(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredShops.length} Werkstätt{filteredShops.length !== 1 ? 'en' : 'e'} gefunden
              </h2>
              {repairDetails.search && (
                <p className="text-gray-600 mt-1">
                  für &quot;
                  <span className="font-medium text-indigo-600">{repairDetails.search}</span>&quot;
                </p>
              )}
            </div>

            {aiSuggestions && (
              <div className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full">
                💰 Durchschnittlich {aiSuggestions.savingsPercentage}% sparen
              </div>
            )}
          </div>

          {/* Shops Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden group flex flex-col h-full"
              >
                {/* Shop Header */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCategoryIcon(shop.category)}</div>
                      <div className="flex-1">
                        <Link href={`/shops/${shop.id}`} className="block">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {shop.name}
                          </h3>
                        </Link>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                          {getCategoryDisplayName(shop.category)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 min-h-[100px] sm:min-h-[120px] flex flex-col">
                    {shop.description && (
                      <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                        {shop.description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2 sm:line-clamp-1">
                          {shop.address}, {shop.postalCode} {shop.city}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        {shop.phone && (
                          <div className="flex items-center text-gray-600">
                            <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                            <a
                              href={`tel:${shop.phone}`}
                              className="hover:text-indigo-600 transition-colors"
                            >
                              {shop.phone}
                            </a>
                          </div>
                        )}

                        {shop.website && (
                          <div className="flex items-center text-gray-600">
                            <GlobeAltIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                            <a
                              href={shop.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-indigo-600 transition-colors text-xs"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span>Schnelle Antwort</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-green-600">CHF 100 Bonus</div>
                  </div>

                  <Link href={`/shops/${shop.id}`} className="block w-full">
                    <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm">
                      {repairDetails.search
                        ? `${repairDetails.search} reparieren lassen`
                        : 'Profil ansehen'}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Werkstätten gefunden
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {repairDetails.search
                  ? `Keine Werkstätten für &quot;${repairDetails.search}&quot; gefunden. Versuchen Sie eine andere Suche.`
                  : 'Versuchen Sie, Ihre Suchbegriffe oder Kategoriefilter anzupassen.'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Neue Reparaturanfrage starten
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
