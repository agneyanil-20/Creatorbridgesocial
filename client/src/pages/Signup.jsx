import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Briefcase, Video, ArrowRight, Eye, EyeOff, Check, ChevronDown } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get('role') ? 2 : 1);
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    // Creator fields
    niche: '',
    platforms: [],
    follower_count: '',
    rate_per_post: '',
    bio: '',
    // Business fields
    company_name: '',
    industry: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const togglePlatform = (p) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter(x => x !== p)
        : [...f.platforms, p],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (role === 'creator' && !form.niche) { setError('Please select your niche.'); return; }
    if (role === 'creator' && form.platforms.length === 0) { setError('Please select at least one platform.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = signup({
      ...form,
      role,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.full_name)}&backgroundColor=6C3EF6&textColor=ffffff`,
      follower_count: Number(form.follower_count) || 0,
      rate_per_post: Number(form.rate_per_post) || 0,
    });
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-gray-100 p-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-2xl font-extrabold text-gray-900">Join CreatorBridge</h1>
                <p className="text-gray-500 mt-2">Who are you joining as?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button
                  onClick={() => handleRoleSelect('business')}
                  className="group p-7 rounded-2xl border-2 border-gray-100 hover:border-[#6C3EF6] hover:bg-purple-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-purple-100 group-hover:bg-[#6C3EF6] rounded-xl flex items-center justify-center mb-4 transition-all">
                    <Briefcase size={22} className="text-[#6C3EF6] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">I'm a Business</h3>
                  <p className="text-sm text-gray-500">Post campaigns and find the perfect creators for your brand.</p>
                  <div className="mt-4 flex items-center text-[#6C3EF6] font-semibold text-sm">
                    Get started <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSelect('creator')}
                  className="group p-7 rounded-2xl border-2 border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-900 rounded-xl flex items-center justify-center mb-4 transition-all">
                    <Video size={22} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">I'm a Creator</h3>
                  <p className="text-sm text-gray-500">Discover brand campaigns and earn by creating content you love.</p>
                  <div className="mt-4 flex items-center text-gray-900 font-semibold text-sm">
                    Get started <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6C3EF6] font-semibold hover:underline">Log in</Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
                ← Back
              </button>
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${role === 'business' ? 'bg-purple-100 text-[#6C3EF6]' : 'bg-gray-100 text-gray-700'}`}>
                  {role === 'business' ? <Briefcase size={14} /> : <Video size={14} />}
                  {role === 'business' ? 'Business' : 'Creator'} Account
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-3">Create your account</h1>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {role === 'business' ? 'Your Full Name' : 'Your Full Name'}
                  </label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required
                    placeholder={role === 'business' ? 'Sarah Chen' : 'Alex Rivera'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                  />
                </div>

                {/* Business-only */}
                {role === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                    <input name="company_name" value={form.company_name} onChange={handleChange} required
                      placeholder="Nike Digital"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm pr-11"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Creator-only fields */}
                {role === 'creator' && (
                  <>
                    {/* Niche selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Content Niche <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <select
                          name="niche"
                          value={form.niche}
                          onChange={handleChange}
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
                      {form.niche && (
                        <p className="text-xs text-[#6C3EF6] mt-1.5 font-medium">
                          {NICHE_ICONS[form.niche]} Selected: <strong>{form.niche}</strong>
                        </p>
                      )}
                    </div>

                    {/* Platforms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platforms you create on <span className="text-red-400">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => togglePlatform(p)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                              form.platforms.includes(p)
                                ? 'bg-[#6C3EF6] text-white border-[#6C3EF6]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {form.platforms.includes(p) && <Check size={12} className="inline mr-1" />}
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Follower count + Rate */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Follower Count</label>
                        <input name="follower_count" type="number" min="0" value={form.follower_count} onChange={handleChange}
                          placeholder="e.g. 50000"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Rate per Post ($)</label>
                        <input name="rate_per_post" type="number" min="0" value={form.rate_per_post} onChange={handleChange}
                          placeholder="e.g. 500"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                        placeholder="Tell brands what makes your content unique..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm resize-none"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2 text-sm text-gray-500 pt-1">
                  <div className="w-4 h-4 rounded mt-0.5 bg-green-100 border border-green-300 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-green-600" />
                  </div>
                  <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 ${
                    role === 'business'
                      ? 'bg-[#6C3EF6] hover:bg-[#5B33D1] shadow-purple-200'
                      : 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Create Account'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6C3EF6] font-semibold hover:underline">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
