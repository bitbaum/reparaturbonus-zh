'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/lib/constants/routes';
import { CATEGORY_LABELS, SHOP_CATEGORIES } from '@/lib/constants/categories';
import { CATEGORY_ICONS } from '@/lib/constants/category-icons';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Store } from 'lucide-react';

export default function Header() {
  // Temporarily disable session for build - add error handling
  let session = null;
  let status = 'unauthenticated';

  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch {
    // Session provider not available during build
    console.log('Session provider not available');
  }

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [werkstattenDropdownOpen, setWerkstattenDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.HOME });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getCategoryPath = (category: string) => {
    return `/shops?category=${category.toUpperCase()}`;
  };

  const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] ?? CATEGORY_ICONS.ALL;
    return <Icon className={className} />;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20'
          : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            scrolled ? 'py-2' : 'py-3'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center group" onClick={closeMobileMenu}>
              <Image
                src="/logo/logo_main_light_transparent.png"
                alt="Stadt Zürich Reparaturbonus"
                width={scrolled ? 120 : 140}
                height={scrolled ? 30 : 35}
                className="transition-all duration-300 group-hover:opacity-80 object-contain w-28 sm:w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-brand focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Werkstätten Dropdown - Fixed hover behavior */}
            <div
              className="relative group"
              onMouseEnter={() => setWerkstattenDropdownOpen(true)}
              onMouseLeave={() => setWerkstattenDropdownOpen(false)}
            >
              <Link
                href={ROUTES.SHOPS}
                className={`flex items-center space-x-1 text-gray-700 hover:text-brand font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap py-2 ${
                  scrolled ? 'text-sm' : 'text-sm lg:text-base'
                }`}
              >
                <span>Werkstätten</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${werkstattenDropdownOpen ? 'rotate-180' : ''}`}
                />
              </Link>

              {/* Dropdown Menu - No gap, proper megamenu */}
              <div
                className={`absolute top-full left-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-3 transition-all duration-200 ${
                  werkstattenDropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible translate-y-2'
                }`}
              >
                <div className="px-3">
                  <Link
                    href={ROUTES.SHOPS}
                    className="flex items-center px-3 py-3 text-text hover:bg-brand-soft hover:text-brand transition-colors rounded-btn"
                  >
                    <Store className="h-5 w-5 mr-3 text-text-muted" />
                    <div>
                      <div className="font-medium">Alle Werkstätten</div>
                      <div className="text-xs text-text-muted">Gesamte Übersicht</div>
                    </div>
                  </Link>

                  <div className="border-t border-border my-2"></div>

                  <div className="mb-3">
                    <div className="px-3 py-1 text-xs font-semibold text-action uppercase tracking-wide">
                      Mit Reparaturbonus (CHF 100)
                    </div>
                    {[
                      SHOP_CATEGORIES.ELECTRONICS,
                      SHOP_CATEGORIES.CLOTHING,
                      SHOP_CATEGORIES.SHOES,
                    ].map((category) => (
                      <Link
                        key={category}
                        href={getCategoryPath(category)}
                        className="flex items-center px-3 py-2 text-text hover:bg-brand-soft hover:text-brand transition-colors rounded-btn"
                      >
                        <CategoryIcon
                          category={category}
                          className="h-5 w-5 mr-3 text-text-muted"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{CATEGORY_LABELS[category]}</div>
                        </div>
                        <div className="text-xs text-action font-medium">CHF 100</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={ROUTES.HOW_IT_WORKS}
              className={`text-gray-700 hover:text-brand font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap ${
                scrolled ? 'text-sm' : 'text-sm lg:text-base'
              }`}
            >
              Anleitung
            </Link>

            {status === 'authenticated' && session ? (
              <>
                <Link
                  href={ROUTES.DASHBOARD}
                  className={`text-gray-700 hover:text-brand font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap ${
                    scrolled ? 'text-sm' : 'text-sm lg:text-base'
                  }`}
                >
                  Dashboard
                </Link>

                {(session?.user as { role?: string })?.role === 'ADMIN' ||
                (session?.user as { role?: string })?.role === 'SUPER_ADMIN' ? (
                  <Link
                    href={ROUTES.ADMIN}
                    className={`text-gray-700 hover:text-brand font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap ${
                      scrolled ? 'text-sm' : 'text-sm lg:text-base'
                    }`}
                  >
                    Admin
                  </Link>
                ) : null}

                <div className="flex items-center space-x-2 lg:space-x-4">
                  <span
                    className={`text-gray-700 transition-all duration-300 hidden lg:inline ${
                      scrolled ? 'text-sm' : 'text-sm'
                    }`}
                  >
                    Willkommen, {session?.user?.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`text-gray-700 hover:text-brand font-medium transition-all duration-200 whitespace-nowrap ${
                      scrolled ? 'text-sm' : 'text-sm lg:text-base'
                    }`}
                  >
                    Abmelden
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link
                  href={ROUTES.AUTH.SIGNIN}
                  className={`text-gray-700 hover:text-brand font-medium transition-all duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap ${
                    scrolled ? 'text-sm' : 'text-sm lg:text-base'
                  }`}
                >
                  Anmelden
                </Link>
                <Link
                  href={ROUTES.AUTH.SIGNUP}
                  className={`bg-action text-on-brand font-medium rounded-btn hover:bg-action-strong transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap ${
                    scrolled ? 'px-2 py-1.5 text-sm' : 'px-3 py-2 text-sm lg:px-4 lg:text-base'
                  }`}
                >
                  Registrieren
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 absolute left-0 right-0 top-full shadow-lg">
            <nav className="px-4 py-4 space-y-4">
              <Link
                href={ROUTES.SHOPS}
                className="block text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                onClick={closeMobileMenu}
              >
                Reparaturwerkstätten
              </Link>

              {/* Mobile category submenu */}
              <div className="pl-4 space-y-2">
                <div className="text-xs font-semibold text-action uppercase tracking-wide mb-2">
                  Mit Bonus (CHF 100)
                </div>
                {[SHOP_CATEGORIES.ELECTRONICS, SHOP_CATEGORIES.CLOTHING, SHOP_CATEGORIES.SHOES].map(
                  (category) => (
                    <Link
                      key={category}
                      href={getCategoryPath(category)}
                      className="flex items-center text-text-muted hover:text-brand transition-colors duration-200 py-1"
                      onClick={closeMobileMenu}
                    >
                      <CategoryIcon category={category} className="h-4 w-4 mr-2" />
                      <span className="text-sm">{CATEGORY_LABELS[category]}</span>
                    </Link>
                  ),
                )}
              </div>

              <Link
                href={ROUTES.HOW_IT_WORKS}
                className="block text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                onClick={closeMobileMenu}
              >
                Wie es funktioniert
              </Link>

              {status === 'authenticated' && session ? (
                <>
                  <Link
                    href={ROUTES.DASHBOARD}
                    className="block text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>

                  {(session?.user as { role?: string })?.role === 'ADMIN' ||
                  (session?.user as { role?: string })?.role === 'SUPER_ADMIN' ? (
                    <Link
                      href={ROUTES.ADMIN}
                      className="block text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                      onClick={closeMobileMenu}
                    >
                      Admin
                    </Link>
                  ) : null}

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 text-sm mb-2">Willkommen, {session?.user?.name}</p>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                    >
                      Abmelden
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    href={ROUTES.AUTH.SIGNIN}
                    className="block text-gray-700 hover:text-brand font-medium transition-colors duration-200 py-2"
                    onClick={closeMobileMenu}
                  >
                    Anmelden
                  </Link>
                  <Link
                    href={ROUTES.AUTH.SIGNUP}
                    className="block bg-action text-on-brand font-medium rounded-btn hover:bg-action-strong transition-colors duration-200 px-4 py-2 text-center"
                    onClick={closeMobileMenu}
                  >
                    Registrieren
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
