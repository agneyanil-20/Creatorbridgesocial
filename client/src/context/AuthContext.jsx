import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cmrcubdcazblpudsrphl.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcmN1YmRjYXpibHB1ZHNycGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjc3MTMsImV4cCI6MjA5MDk0MzcxM30.XCBm9o40Mv5W0utR8aTikWmYuDtfUi-SlYkcWfL6X6Q';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for tokens in URL hash (returned from OAuth)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        localStorage.setItem('access_token', token);
        validateSession(token);
        // Clear hash from URL
        window.history.replaceState(null, null, window.location.pathname);
        return;
      }
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      validateSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async (token) => {
    try {
      const uRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        }
      });
      if (!uRes.ok) throw new Error('Invalid session');
      const uData = await uRes.json();
      
      const pRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${uData.id}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        }
      });
      const pData = pRes.ok ? await pRes.json() : [];
      
      setUser({
        id: uData.id,
        email: uData.email,
        token: token,
        hasProfile: pData.length > 0,
        profile: pData[0] || null,
        role: pData[0]?.role,
        full_name: pData[0]?.full_name || pData[0]?.name,
        avatar_url: pData[0]?.avatar_url
      });
    } catch (e) {
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
    if (!user || !user.id) return { success: false, error: 'No user session' };
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return { success: true, url: publicUrl };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed');
      
      localStorage.setItem('access_token', data.access_token);
      await validateSession(data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Signup failed');
      
      // Setup minimal session to allow onboarding creation
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        await validateSession(data.access_token);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const completeOnboarding = async (profileData) => {
    if (!user || !user.token) return { success: false, error: 'No session' };
    
    // Set default avatar based on name if not provided
    if (!profileData.avatar_url) {
      profileData.avatar_url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.full_name || 'User')}&backgroundColor=6C3EF6&textColor=ffffff`;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: profileData.full_name, // Mapping for backward compatibility
          ...profileData
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save profile');
      }
      
      const newProfile = await res.json();
      setUser({
        ...user,
        hasProfile: true,
        profile: newProfile[0],
        role: newProfile[0].role,
        full_name: newProfile[0].full_name,
        avatar_url: newProfile[0].avatar_url
      });
      return { success: true };
    } catch (error) {
       return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, completeOnboarding, uploadAvatar }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
