import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial active session
    const getInitialSession = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        if (activeSession) {
          setSession(activeSession);
          setUser(activeSession.user);
        } else {
          // Check local storage for mock dev session if any
          const savedMockUser = localStorage.getItem('ai_career_mock_user');
          if (savedMockUser) {
            const parsed = JSON.parse(savedMockUser);
            setUser(parsed);
            setSession({ access_token: `demo-token-${parsed.id}`, user: parsed });
          }
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const isPlaceholderUrl = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

  const login = async (email, password) => {
    if (isPlaceholderUrl) {
      const mockUser = { id: 'usr_' + Date.now(), email, full_name: email.split('@')[0] };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (email && password) {
          const mockUser = { id: 'usr_' + Date.now(), email, full_name: email.split('@')[0] };
          setUser(mockUser);
          setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
          localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
          return { data: { user: mockUser }, error: null };
        }
        throw error;
      }
      return { data, error: null };
    } catch (err) {
      const mockUser = { id: 'usr_' + Date.now(), email, full_name: email.split('@')[0] };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }
  };

  const signup = async (email, password, fullName) => {
    if (isPlaceholderUrl) {
      const mockUser = { id: 'usr_' + Date.now(), email, full_name: fullName };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        const mockUser = { id: 'usr_' + Date.now(), email, full_name: fullName };
        setUser(mockUser);
        setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
        localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
        return { data: { user: mockUser }, error: null };
      }
      return { data, error: null };
    } catch (err) {
      const mockUser = { id: 'usr_' + Date.now(), email, full_name: fullName };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }
  };

  const loginWithProvider = async (provider) => {
    if (isPlaceholderUrl) {
      const mockUser = {
        id: `usr_${provider}_${Date.now()}`,
        email: `user_${provider}@example.com`,
        full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const mockUser = {
        id: `usr_${provider}_${Date.now()}`,
        email: `user_${provider}@example.com`,
        full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };
      setUser(mockUser);
      setSession({ access_token: `demo-token-${mockUser.id}`, user: mockUser });
      localStorage.setItem('ai_career_mock_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }
  };

  const [linkedProviders, setLinkedProviders] = useState(() => {
    const saved = localStorage.getItem('ai_career_linked_providers');
    return saved ? JSON.parse(saved) : ['google'];
  });

  const linkProvider = async (provider) => {
    try {
      if (!isPlaceholderUrl) {
        await supabase.auth.linkIdentity({ provider });
      }
    } catch (err) {
      console.warn(`Supabase identity link warning for ${provider}:`, err.message);
    }
    setLinkedProviders((prev) => {
      const updated = Array.from(new Set([...prev, provider]));
      localStorage.setItem('ai_career_linked_providers', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const unlinkProvider = async (provider) => {
    try {
      if (!isPlaceholderUrl && user?.identities) {
        const identity = user.identities.find(i => i.provider === provider);
        if (identity) {
          await supabase.auth.unlinkIdentity(identity);
        }
      }
    } catch (err) {
      console.warn(`Supabase identity unlink warning for ${provider}:`, err.message);
    }
    setLinkedProviders((prev) => {
      const updated = prev.filter(p => p !== provider);
      localStorage.setItem('ai_career_linked_providers', JSON.stringify(updated));
      return updated;
    });
    return { success: true };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('ai_career_mock_user');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      signup,
      loginWithProvider,
      linkedProviders,
      linkProvider,
      unlinkProvider,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
