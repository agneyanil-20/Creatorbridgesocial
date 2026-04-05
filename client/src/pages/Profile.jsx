import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/supabaseClient";
import { 
  Star, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  Bookmark, 
  TrendingUp, 
  Instagram, 
  Globe, 
  MessageSquare,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import { NICHE_ICONS } from '../constants';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCreator(data);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbff] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#6C3EF6] animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#fafbff] flex items-center justify-center p-6">
        <div className="text-center p-10 md:p-14 bg-white rounded-[3rem] border border-gray-100 shadow-2xl">
          <p className="text-6xl mb-6">😕</p>
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Profile not found</h2>
          <p className="text-gray-400 mb-8 font-medium">The creator you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/creators')} 
            className="bg-[#6C3EF6] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#5B33D1] transition-all"
          >
            Browse creators →
          </button>
        </div>
      </div>
    );
  }

  const avatar = creator?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${creator?.username || 'User'}&backgroundColor=6C3EF6&textColor=ffffff`;

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Premium Header Banner */}
      <div className="h-[35vh] relative overflow-hidden bg-gradient-to-br from-purple-600 via-[#6C3EF6] to-indigo-700">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400 rounded-full blur-[120px]" />
        </div>
        
        {/* Navigation Over Header */}
        <div className="absolute top-8 inset-x-0 max-w-7xl mx-auto px-6 flex justify-between items-center z-20">
          <button
            onClick={() => navigate(-1)}
            className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl shadow-black/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-4">
            <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl shadow-black/5">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content Body */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Profile Card */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl shadow-purple-200/30 relative overflow-hidden group">
               {/* User Avatar */}
               <div className="relative mb-8 text-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[3.5rem] overflow-hidden mx-auto border-8 border-white shadow-2xl bg-gray-50 transform group-hover:scale-[1.02] transition-transform duration-700">
                     <img 
                       src={avatar} 
                       className="w-full h-full object-cover" 
                       alt={creator?.username || 'Creator'} 
                     />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#6C3EF6] px-5 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-purple-50">
                     <BadgeCheck size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified {creator?.role || 'Creator'}</span>
                  </div>
               </div>

               <div className="text-center mt-10">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 leading-none truncate px-2">{creator?.full_name || creator?.username}</h1>
                  <p className="text-[#6C3EF6] text-sm font-black uppercase tracking-widest mb-6 truncate px-4">@{creator?.username || 'creator'}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                     <div className="px-5 py-2 bg-purple-50 text-[#6C3EF6] rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-purple-100 flex items-center gap-2">
                        {NICHE_ICONS[creator?.niche] || '✨'} {creator?.niche || 'General'}
                     </div>
                  </div>

                  <hr className="border-gray-50 mb-8" />

                  {/* Social & Contact Links */}
                  <div className="space-y-3 mb-10 text-left">
                     {creator?.instagram && (
                       <a 
                         href={`https://instagram.com/${creator?.instagram.replace('@', '')}`} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center justify-between p-5 bg-gray-50 hover:bg-purple-50 rounded-2xl border border-gray-50 hover:border-purple-100 transition-all group/link"
                       >
                         <div className="flex items-center gap-4">
                            <Instagram size={18} className="text-gray-400 group-hover/link:text-[#6C3EF6]" />
                            <span className="text-sm font-bold text-gray-700 group-hover/link:text-gray-900">Instagram</span>
                         </div>
                         <ExternalLink size={16} className="text-gray-200 group-hover/link:text-[#6C3EF6]" />
                       </a>
                     )}
                     {creator?.website && (
                       <a 
                         href={creator?.website} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center justify-between p-5 bg-gray-50 hover:bg-purple-50 rounded-2xl border border-gray-50 hover:border-purple-100 transition-all group/link"
                       >
                         <div className="flex items-center gap-4">
                            <Globe size={18} className="text-gray-400 group-hover/link:text-[#6C3EF6]" />
                            <span className="text-sm font-bold text-gray-700 group-hover/link:text-gray-900">Website</span>
                         </div>
                         <ExternalLink size={16} className="text-gray-200 group-hover/link:text-[#6C3EF6]" />
                       </a>
                     )}
                  </div>

                  <button className="w-full py-5 bg-[#6C3EF6] text-white font-black rounded-[2rem] shadow-xl shadow-purple-200/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95">
                     <MessageSquare size={20} />
                     Connect Now
                  </button>
               </div>
            </div>
          </div>

          {/* Main Info Area */}
          <div className="flex-1 lg:pt-32">
             <div className="bg-white rounded-[3.5rem] border border-gray-100 p-10 md:p-12 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                   <TrendingUp size={24} className="text-[#6C3EF6]" />
                   <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">About Creator</h2>
                </div>
                
                <div className="relative">
                   <p className="text-xl sm:text-2xl text-gray-700 font-medium leading-relaxed italic mb-12">
                     "{creator?.bio || "No bio provided yet. Just browsing the marketplace for now!"}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Reach</p>
                         <p className="text-3xl font-black text-gray-900">
                           {creator?.follower_count >= 1000000 
                             ? `${(creator?.follower_count / 1000000).toFixed(1)}M` 
                             : creator?.follower_count >= 1000 ? `${(creator?.follower_count / 1000).toFixed(0)}K` : creator?.follower_count || '0'}
                         </p>
                      </div>
                   </div>
                   <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                         <p className="text-[10px] font-black text-[#6C3EF6] uppercase tracking-widest mb-2 leading-none">Avg. Cost</p>
                         <p className="text-3xl font-black text-[#6C3EF6]">
                           ${creator?.rate_per_post >= 1000 
                              ? `${(creator?.rate_per_post/1000).toFixed(0)}k` 
                              : creator?.rate_per_post || '0'}
                         </p>
                      </div>
                   </div>
                   <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">Rating</p>
                         <p className="text-3xl font-black text-gray-900">4.9/5.0</p>
                      </div>
                   </div>
                </div>

                <div className="mt-16 pt-12 border-t border-gray-50 flex flex-col md:flex-row gap-8 items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-50">
                         <CheckCircle size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Identity Verified</p>
                         <p className="text-xs text-gray-400 font-medium tracking-tight">Verified through Stripe Connect</p>
                      </div>
                   </div>
                   <button className="flex items-center gap-2 text-gray-300 font-bold hover:text-gray-500 transition-all text-[11px] uppercase tracking-widest group">
                      Report Profile <ArrowLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
