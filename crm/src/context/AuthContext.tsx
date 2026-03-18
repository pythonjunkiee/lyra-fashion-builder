import { createContext, useContext, useState, useCallback } from 'react';

const SESSION_KEY = 'lyra_admin_key';

interface AuthContextValue {
  isAuthenticated: boolean;
  apiKey: string;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string>(() => {
    return sessionStorage.getItem(SESSION_KEY) ?? '';
  });

  const isAuthenticated = apiKey.length > 0;

  const login = useCallback((key: string) => {
    sessionStorage.setItem(SESSION_KEY, key);
    setApiKey(key);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setApiKey('');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Read the API key at call-time from sessionStorage — never from env/bundle. */
export function getApiKey(): string {
  return sessionStorage.getItem(SESSION_KEY) ?? '';
}
