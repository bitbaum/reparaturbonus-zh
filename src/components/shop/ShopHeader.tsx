import { Shop } from '@/types/shop';
import { CATEGORY_LABELS, getCategoryIcon } from '@/types/shop';
import {
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  StarIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ShopHeaderProps {
  shop: Shop;
  averageRating: number;
}

export function ShopHeader({ shop, averageRating }: ShopHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <div className="text-3xl sm:text-4xl bg-white/10 p-2 sm:p-3 rounded-xl flex-shrink-0 mx-auto sm:mx-0">
                {getCategoryIcon(shop.category)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{shop.name}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 sm:gap-x-4 gap-y-2 text-indigo-100 mb-3 sm:mb-4">
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/20">
                    {CATEGORY_LABELS[shop.category] || shop.category}
                  </span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1" />
                    <span className="text-sm sm:text-base font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs sm:text-sm ml-1">
                      ({shop.reviews?.length || 0} Bewertungen)
                    </span>
                  </div>
                  {shop.experienceYears && (
                    <span className="text-xs sm:text-sm">
                      {shop.experienceYears}+ Jahre Erfahrung
                    </span>
                  )}
                </div>
                <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {shop.description}
                </p>
              </div>
            </div>

            {/* Specializations */}
            {shop.specializations && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center sm:text-left">
                  Spezialisierungen
                </h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {shop.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center lg:text-left">
              Kontakt & Öffnungszeiten
            </h3>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm sm:text-base font-medium">{shop.address}</div>
                  <div className="text-xs sm:text-sm text-indigo-100">
                    {shop.postalCode} {shop.city}
                  </div>
                </div>
              </div>

              {shop.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <a
                    href={`tel:${shop.phone}`}
                    className="text-sm sm:text-base hover:text-indigo-200 transition-colors"
                  >
                    {shop.phone}
                  </a>
                </div>
              )}

              {shop.email && (
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <a
                    href={`mailto:${shop.email}`}
                    className="text-sm sm:text-base hover:text-indigo-200 transition-colors break-all"
                  >
                    {shop.email}
                  </a>
                </div>
              )}

              {shop.website && (
                <div className="flex items-center">
                  <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base hover:text-indigo-200 transition-colors"
                  >
                    Website besuchen
                  </a>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full bg-white text-indigo-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center group">
                <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Termin vereinbaren
              </button>
              <button className="w-full bg-indigo-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-400 transition-colors flex items-center justify-center group">
                <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Chat starten
              </button>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
              <div className="flex items-center justify-center text-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">CHF 100</div>
                  <div className="text-xs sm:text-sm text-indigo-100">Bonus verfügbar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
