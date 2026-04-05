import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NICHES, NICHE_ICONS } from '../constants';
import { Briefcase, Video, ChevronDown, Camera, User, Instagram, Globe, Info, Loader2 } from 'lucide-react';

export default function Onboarding() {
  const { user, completeOnboarding, uploadAvatar } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [niche, setNiche] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto redirect if profile already exists
  useEffect(() => {
    if (user?.hasProfile) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) return setError('Please select a role.');
    if (!username) return setError('Username is required.');
    if (role === 'creator' && !niche) return setError('Please select your niche.');

    setLoading(true);
    let finalAvatarUrl = null;

    try {
      // 1. Upload avatar if selected
      if (avatarFile) {
        setUploading(true);
        const uploadRes = await uploadAvatar(avatarFile);
        setUploading(false);
        if (uploadRes.success) {
          finalAvatarUrl = uploadRes.url;
        } else {
          throw new Error(uploadRes.error || 'Failed to upload avatar');
        }
      }

      // 2. Complete onboarding
      const result = await completeOnboarding({
        role,
        full_name: fullName,
        username,
        bio,
        niche: niche || null, // Using niche as category
        instagram,
        website,
        avatar_url: finalAvatarUrl,
        company_name: role === 'business' ? fullName : null,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbff] flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100/50 border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Your Profile</h1>
            <p className="text-gray-500 mt-2 font-medium">Join the marketplace and start connecting.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-5 py-4 rounded-2xl mb-8 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Avatar Upload */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-50 group-hover:opacity-90 transition-all">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                    <Loader2 size={32} className="text-[#6C3EF6] animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-[#6C3EF6] uppercase tracking-widest">Click to upload photo</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {/* 2. Role Selection */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Joining as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('business')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    role === 'business' ? 'border-[#6C3EF6] bg-purple-50' : 'border-gray-50 hover:border-purple-100'
                  }`}
                >
                  <Briefcase size={20} className={role === 'business' ? 'text-[#6C3EF6]' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${role === 'business' ? 'text-[#6C3EF6]' : 'text-gray-500'}`}>Business</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    role === 'creator' ? 'border-gray-900 bg-gray-50' : 'border-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Video size={20} className={role === 'creator' ? 'text-gray-900' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${role === 'creator' ? 'text-gray-900' : 'text-gray-500'}`}>Creator</span>
                </button>
              </div>
            </div>

            {role && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="alex_creator"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                       {role === 'business' ? 'Company Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === 'business' ? 'Nike Digital' : 'Alex Rivera'}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bio / About</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself or your brand..."
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category / Niche {role === 'creator' && '*'}</label>
                    <div className="relative">
                      <select
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        required={role === 'creator'}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium appearance-none pr-12"
                      >
                        <option value="">Select Category</option>
                        {NICHES.map(n => (
                          <option key={n} value={n}>{NICHE_ICONS[n]} {n}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Instagram</label>
                    <div className="relative">
                      <Instagram size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@username"
                        className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Website / Link</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-0 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full bg-[#6C3EF6] hover:bg-[#5B33D1] text-white font-black py-5 rounded-[2rem] transition-all shadow-xl shadow-purple-200/50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                    <Info size={12} /> Data is secured with Supabase RLS
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
}
