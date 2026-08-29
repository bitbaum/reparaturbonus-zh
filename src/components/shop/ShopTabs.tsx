import { useState } from 'react';
import { Shop } from '@/types/shop';
import {
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ShopTabsProps {
  shop: Shop;
  averageRating: number;
}

export function ShopTabs({ shop, averageRating }: ShopTabsProps) {
  const [activeTab, setActiveTab] = useState<'leistungen' | 'reviews' | 'about'>('leistungen');

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('leistungen')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'leistungen'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Leistungen & Preise
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bewertungen ({shop.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'about'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Über uns
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          {/* Leistungen Tab */}
          {activeTab === 'leistungen' && (
            <div className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Leistungen & Preise</h2>
              {shop.services ? (
                <div className="space-y-4">
                  {shop.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-lg font-bold text-indigo-600 sm:text-right">
                          {service.price}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm lg:text-base">
                        {service.description}
                      </p>
                      {service.duration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Dauer: {service.duration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Keine Leistungen verfügbar</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Kundenbewertungen</h2>
                <div className="text-center sm:text-right">
                  <div className="flex items-center justify-center sm:justify-end">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {shop.reviews?.length || 0} Bewertungen
                  </div>
                </div>
              </div>

              {shop.reviews && shop.reviews.length > 0 ? (
                <div className="space-y-4">
                  {shop.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 font-medium text-gray-900">{review.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm lg:text-base">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Noch keine Bewertungen vorhanden</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Über {shop.name}</h2>

              {shop.aboutText ? (
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed whitespace-pre-line">
                    {shop.aboutText}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Keine zusätzlichen Informationen verfügbar</p>
                </div>
              )}

              {/* Specializations */}
              {shop.specializations && shop.specializations.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Spezialisierungen</h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {shop.certifications && shop.certifications.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Zertifikate & Qualifikationen
                  </h3>
                  <div className="space-y-2">
                    {shop.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700 text-sm lg:text-base">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {shop.experienceYears && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Erfahrung</h3>
                  <p className="text-gray-700 text-sm lg:text-base">
                    {shop.experienceYears} Jahre Erfahrung in der Reparaturbranche
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="mt-8 lg:mt-0">
          {/* Contact Card */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Kontakt aufnehmen</h3>
            <div className="space-y-3">
              <a
                href={`tel:${shop.phone}`}
                className="flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Anrufen
              </a>
              <button className="flex items-center justify-center w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Nachricht senden
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <p className="mb-1">📍 {shop.address}</p>
              <p className="mb-1">📞 {shop.phone}</p>
              <p>✉️ {shop.email}</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Warum uns vertrauen?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm lg:text-base">
                    CHF 100 Bonus garantiert
                  </div>
                  <div className="text-sm text-gray-600">Nach jeder Reparatur</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm lg:text-base">
                    Zertifizierte Werkstatt
                  </div>
                  <div className="text-sm text-gray-600">Geprüfte Qualität</div>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm lg:text-base">Faire Preise</div>
                  <div className="text-sm text-gray-600">Transparente Kostenvoranschläge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
