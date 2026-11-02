import type { ReactNode } from 'react';
import Link from 'next/link';

/**
 * The one auth page layout: marketing column on the left, a white card on the
 * right and a way home. Sign-in and sign-up were two hand-copied versions of
 * this; the copy that differs between them is passed in, the chrome is not.
 * The line that switches to the other page belongs to AccountKit's form, the
 * same line on every fleet app, so the card does not repeat it.
 */
export function AuthShell({
  marketing,
  title,
  subtitle,
  children,
}: {
  marketing: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Marketing Content */}
          <div className="order-2 lg:order-1">
            <div className="max-w-lg">{marketing}</div>
          </div>

          {/* Form card */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">{subtitle}</p>
              </div>

              {children}
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
