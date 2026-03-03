import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

const DEV_USER: User = {
  id: 'dev-user-00000000-0000-0000-0000-000000000000',
  email: 'dev@pullup.test',
  app_metadata: {},
  user_metadata: { name: 'Dev User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const DEV_SESSION: Session = {
  access_token: 'dev-token',
  refresh_token: 'dev-refresh',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: DEV_USER,
} as Session;

export interface SignUpMetadata {
  first_name: string;
  last_name: string;
  school?: string;
  graduation_year?: number;
  major?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDevMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: Error | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  devSignIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isDevMode) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDevMode]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    console.log('[Auth] signUp called for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.first_name,
          last_name: metadata.last_name,
          name: `${metadata.first_name} ${metadata.last_name}`.trim(),
          school: metadata.school,
          graduation_year: metadata.graduation_year,
          major: metadata.major,
        },
      },
    });
    console.log('[Auth] signUp response — error:', error, 'user:', data?.user?.id, 'session:', !!data?.session);
    if (error) return { error: error as Error | null, needsConfirmation: false };
    // Supabase returns a fake user with no identities when email already exists
    if (data.user && data.user.identities?.length === 0) {
      return { error: new Error('An account with this email already exists.'), needsConfirmation: false };
    }
    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
  };

  const signOut = async () => {
    if (isDevMode) {
      setIsDevMode(false);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const devSignIn = () => {
    setIsDevMode(true);
    setSession(DEV_SESSION);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        isDevMode,
        signIn,
        signUp,
        signOut,
        devSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
