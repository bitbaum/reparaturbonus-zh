'use client';

import Link from 'next/link';
import {
  AccountPanel,
  SignInForm,
  SignUpForm,
  type AuthClasses,
  type AuthLabels,
} from '@bitbaum/accountkit/auth/react';
import type { SignInMethods } from '@bitbaum/accountkit/auth';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/lib/constants/routes';

/**
 * The fleet's account screens (@bitbaum/accountkit/auth/react) in the
 * Reparaturbonus look. The logic and the words are the package's, the same in
 * every product; only the classes are ours.
 */
const CLASSES: Partial<AuthClasses> = {
  stack: 'flex flex-col gap-5',
  field: 'flex flex-col gap-2',
  label: 'block text-sm font-medium text-gray-700',
  hint: 'text-sm text-gray-600',
  input:
    'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
  button:
    'w-full min-h-11 bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  buttonQuiet:
    'w-full min-h-11 bg-white text-gray-900 py-3 px-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors',
  notice: 'bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800',
  error: 'bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700',
  divider:
    'flex items-center gap-3 text-xs uppercase tracking-wide text-gray-500 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200',
  section: 'flex flex-col gap-4 border-t border-gray-200 pt-8',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  link: 'break-all font-semibold text-indigo-600 hover:text-indigo-500',
  check: 'flex min-h-11 items-center gap-3 text-sm text-gray-700',
};

const textLink = 'font-semibold text-indigo-600 hover:text-indigo-500 transition-colors';

export function ReparaturSignIn(props: {
  labels: AuthLabels;
  methods: SignInMethods;
  next: string;
  signUpHref: string;
  initialError: boolean;
}) {
  return (
    <SignInForm
      client={authClient}
      classes={CLASSES}
      labels={props.labels}
      methods={props.methods}
      next={props.next}
      signInPath={ROUTES.AUTH.SIGNIN}
      initialError={props.initialError}
      signUpLink={
        <Link href={props.signUpHref} className={textLink}>
          {props.labels.createAccount}
        </Link>
      }
    />
  );
}

export function ReparaturSignUp(props: {
  labels: AuthLabels;
  methods: SignInMethods;
  next: string;
  signInHref: string;
}) {
  return (
    <SignUpForm
      client={authClient}
      classes={CLASSES}
      labels={props.labels}
      methods={props.methods}
      next={props.next}
      signUpPath={ROUTES.AUTH.SIGNUP}
      signInPath={ROUTES.AUTH.SIGNIN}
      signInLink={
        <Link href={props.signInHref} className={textLink}>
          {props.labels.signIn}
        </Link>
      }
    />
  );
}

export function ReparaturAccount(props: {
  labels: AuthLabels;
  methods: SignInMethods;
  user: {
    name: string;
    email: string | null;
    emailVerified: boolean;
    role: string;
    twoFactorEnabled: boolean;
  };
  linked: string[];
}) {
  return (
    <AccountPanel
      client={authClient}
      classes={CLASSES}
      accountPath={ROUTES.ACCOUNT}
      homePath={ROUTES.HOME}
      {...props}
    />
  );
}
