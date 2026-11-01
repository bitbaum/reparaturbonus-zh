'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import type { Account } from '@/lib/auth';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AccountState {
  data: Account | null;
  status: Status;
  signOut: (redirectTo?: string) => Promise<void>;
}

const AccountContext = createContext<AccountState>({
  data: null,
  status: 'loading',
  signOut: async () => {},
});

/**
 * Who is signed in, with their role (`/api/account`), for the header and the
 * dashboards. Re-read on every navigation, so signing in or out anywhere shows
 * at once. The role is the server's: these pages only choose what to show, the
 * API routes decide what is allowed.
 */
export default function AccountProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [data, setData] = useState<Account | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let live = true;
    fetch('/api/account', { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<Account | null>) : null))
      .catch(() => null)
      .then((account) => {
        if (!live) return;
        setData(account);
        setStatus(account ? 'authenticated' : 'unauthenticated');
      });
    return () => {
      live = false;
    };
  }, [pathname]);

  const signOut = useCallback(async (redirectTo = '/') => {
    await authClient.signOut().catch(() => undefined);
    setData(null);
    setStatus('unauthenticated');
    window.location.assign(redirectTo);
  }, []);

  return (
    <AccountContext.Provider value={{ data, status, signOut }}>{children}</AccountContext.Provider>
  );
}

export function useAccount(): AccountState {
  return useContext(AccountContext);
}
