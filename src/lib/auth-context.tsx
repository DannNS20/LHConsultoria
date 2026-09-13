'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from './api';
import type { AuthUser } from './types';

// Maqueta: la sesión se guarda en localStorage. En la Fase 1 se migra a cookie httpOnly.
const STORAGE_KEY = 'lhc_admin_session';

interface Session {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  ready: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Devuelve un mensaje legible y cierra la sesión si expiró. */
  errorMessage: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // almacenamiento no disponible: la sesión dura solo esta pestaña
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readSession();
      if (stored) {
        try {
          await api.me(stored.token);
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            writeSession(null);
            if (!cancelled) setReady(true);
            return;
          }
        }
      }
      if (!cancelled) {
        setSession(stored);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await api.login(email, password);
    const next = { token: accessToken, user };
    writeSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const errorMessage = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.status === 401) logout();
        return error.message;
      }
      return 'Ocurrió un error inesperado.';
    },
    [logout],
  );

  const value = useMemo(
    () => ({ ready, session, login, logout, errorMessage }),
    [ready, session, login, logout, errorMessage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
