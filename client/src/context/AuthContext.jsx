import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  {
    id: 'biz-001',
    email: 'nike@demo.com',
    password: 'demo123',
    role: 'business',
    full_name: 'Sarah Chen',
    company_name: 'Nike Digital',
    industry: 'Sports & Fitness',
    website: 'nike.com',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Nike&backgroundColor=6C3EF6&textColor=ffffff',
    bio: 'We partner with creators who embody the spirit of movement and excellence.',
  },
  {
    id: 'biz-002',
    email: 'sephora@demo.com',
    password: 'demo123',
    role: 'business',
    full_name: 'Emma Laurent',
    company_name: 'Sephora Beauty',
    industry: 'Beauty & Cosmetics',
    website: 'sephora.com',
    avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Sephora&backgroundColor=e91e8c&textColor=ffffff',
    bio: 'Connecting beauty lovers with authentic creators worldwide.',
  },
  {
    id: 'demo-creator-001',
    email: 'alex@demo.com',
    password: 'demo123',
    role: 'creator',
    full_name: 'Alex Rivera',
    niche: 'Fitness & Lifestyle',
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    follower_count: 850000,
    rate_per_post: 3500,
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=AlexR',
    bio: 'Fitness creator inspiring 850K+ followers daily with workout routines, healthy recipes, and lifestyle content.',
    location: 'Los Angeles, CA',
    rating: 4.9,
    reviews: 47,
  },
  {
    id: 'demo-creator-002',
    email: 'maya@demo.com',
    password: 'demo123',
    role: 'creator',
    full_name: 'Maya Johnson',
    niche: 'Beauty & Fashion',
    platforms: ['Instagram', 'YouTube'],
    follower_count: 1200000,
    rate_per_post: 5500,
    avatar_url: 'https://api.dicebear.com/7.x/personas/svg?seed=MayaJ',
    bio: 'Beauty & fashion icon with 1.2M followers. Known for authentic reviews and trendsetting content.',
    location: 'New York, NY',
    rating: 4.8,
    reviews: 63,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (account) {
      setUser(account);
      return { success: true, user: account };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const signup = (data) => {
    const newUser = { id: `user-${Date.now()}`, ...data };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
