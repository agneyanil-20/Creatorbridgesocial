import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NICHES, NICHE_ICONS } from '../constants';
import { Briefcase, Video, ChevronDown } from 'lucide-react';

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto redirect if profile already exists
  useEffect(() => {
    if (user?.hasProfile) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role.');
      return;
    }
    if (role === 'creator' && !niche) {
      setError('Please select your niche as a creator.');
      return;
    }

    setLoading(true);
    const result = await completeOnboarding({
      role,
      full_name: fullName,
      niche: role === 'creator' ? niche : null,
      company_name: role === 'business' ? fullName : null, // Fallback for basic data setup
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-500 mt-2">Just a few more details to get started.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Who are you joining as?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <button
                  type="button"
                  onClick={() => setRole('business')}
                  className={`group p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                    role === 'business' ? 'border-[#6C3EF6] bg-purple-50' : 'border-gray-100 hover:border-purple-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                    role === 'business' ? 'bg-[#6C3EF6] text-white' : 'bg-purple-100 text-[#6C3EF6]'
                  }`}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Business</h3>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`group p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                    role === 'creator' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                    role === 'creator' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Video size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Creator</h3>
                  </div>
                </button>
              </div>
            </div>

            {role && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {role === 'business' ? 'Company or Full Name (Optional)' : 'Your Full Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'business' ? 'e.g. Nike Digital' : 'e.g. Alex Rivera'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                  />
                </div>

                {role === 'creator' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Content Niche <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm text-gray-700 bg-white appearance-none pr-10"
                      >
                        <option value="">Select your niche...</option>
                        {NICHES.map(n => (
                          <option key={n} value={n}>{NICHE_ICONS[n]} {n}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 ${
                    role === 'business'
                      ? 'bg-[#6C3EF6] hover:bg-[#5B33D1] shadow-purple-200'
                      : 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Complete Setup'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
