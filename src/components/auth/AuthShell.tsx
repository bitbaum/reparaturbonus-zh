'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * The one auth page layout: marketing column on the left, a white card on the
 * right, a "switch to the other page" line under the card and a way home.
 * Sign-in and sign-up were two hand-copied versions of this; the copy that
 * differs between them is passed in, the chrome is not.
 */
export function AuthShell({
  marketing,
  title,
  subtitle,
  switchPrompt,
  switchHref,
  switchLabel,
  children,
}: {
  marketing: ReactNode;
  title: string;
  subtitle: string;
  switchPrompt: string;
  switchHref: string;
  switchLabel: string;
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

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  {switchPrompt}{' '}
                  <Link
                    href={switchHref}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    {switchLabel}
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

const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-2';
const INPUT_CLASS =
  'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  /** Extra classes on the input; the pages differ only in responsive padding. */
  className?: string;
};

/** A labelled text input in the auth card. `id` doubles as the input name. */
export function AuthField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
  autoComplete,
}: FieldProps & { type?: 'text' | 'email'; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        className={`${INPUT_CLASS} ${className}`.trim()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

/** A labelled password input with its own show/hide toggle. */
export function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = '',
  autoComplete,
}: FieldProps & { autoComplete: 'current-password' | 'new-password' }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          className={`${INPUT_CLASS} pr-12 ${className}`.trim()}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
      <p className="text-red-600 text-sm text-center">{message}</p>
    </div>
  );
}

export function AuthSubmitButton({
  loading,
  pendingLabel,
  children,
}: {
  loading: boolean;
  pendingLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {pendingLabel}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
