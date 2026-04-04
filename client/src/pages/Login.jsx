import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { MessageCircle, Eye, EyeOff, Zap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const loginDemo = async (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(account.email, account.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#6C3EF6] to-[#a855f7] rounded-2xl mx-auto flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to your CreatorBridge account</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap size={12} className="text-yellow-500" /> Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => loginDemo(acc)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all text-left group"
                >
                  <img src={acc.avatar_url} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{acc.full_name || acc.company_name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{acc.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400">or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C3EF6] hover:bg-[#5B33D1] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#6C3EF6] font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
