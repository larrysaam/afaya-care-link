import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'patient' | 'admin' | 'hospital_admin' | 'superadmin' | 'consultation_admin' | 'visa_admin' | 'accommodation_admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userRoles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string, country?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);

  const adminRoles: AppRole[] = ['admin', 'superadmin', 'consultation_admin', 'visa_admin', 'accommodation_admin'];
  const isAdmin = userRoles.some(role => adminRoles.includes(role));
  const isSuperAdmin = userRoles.includes('superadmin');

  const hasRole = (role: AppRole) => userRoles.includes(role);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check roles with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (!error && data) {
        setUserRoles(data.map(r => r.role as AppRole));
      } else {
        setUserRoles([]);
      }
    } catch {
      setUserRoles([]);
    }
  };  const signUp = async (email: string, password: string, fullName: string, phone?: string, country?: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone: phone || '',
          country: country || '',
        }
      }
    });

    if (!error && data.user) {
      // Only create profile if email is confirmed OR if confirmations are disabled
      // If confirmation is required, the profile will be created after email verification
      const emailConfirmed = data.user.confirmed_at !== null;
      
      if (emailConfirmed) {
        // Create profile immediately (email confirmation disabled)
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone || null,
          country: country || null,
        });

        // Assign patient role by default
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'patient',
        });
      }
      // If email confirmation is required, profile will be created by database trigger
      // which will extract phone and country from user metadata
    }

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      isSuperAdmin, 
      userRoles, 
      hasRole, 
      signUp, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
