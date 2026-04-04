import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CREATORS } from '../data/mockData';
import { Star, MapPin, ArrowLeft, ExternalLink, CheckCircle, Bookmark, MoreHorizontal, TrendingUp, Mail } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const creator = MOCK_CREATORS.find(c => c.id === id);

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold mb-2">Creator not found</h2>
          <button onClick={() => navigate('/creators')} className="text-blue-400 font-semibold hover:underline">Browse creators →</button>
        </div>
      </div>
    );
  }

  const platformIcon = (p) => {
    switch (p) {
      case 'Instagram': return '📸';
      case 'YouTube': return '▶';
      case 'TikTok': return '♪';
      case 'Twitch': return '🎮';
      default: return '📱';
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Immersive Banner */}
      <div className="h-[40vh] relative overflow-hidden">
        <img 
          src={creator.avatar_url} 
          className="w-full h-full object-cover blur-3xl scale-125 opacity-40" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/50 to-[#09090b]" />
        
        {/* Top Navigation */}
        <div className="absolute top-6 inset-x-0 max-w-5xl mx-auto px-6 flex justify-between items-center z-20">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all shadow-2xl"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-4">
            <button className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all shadow-2xl">
              <Bookmark size={24} />
            </button>
            <button className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all shadow-2xl">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="max-w-5xl mx-auto px-6 relative -mt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LARGE IMAGE HOLDER BOX */}
          <div className="relative group flex-shrink-0">
             <div className="absolute inset-x-0 -bottom-4 bg-cyan-500 rounded-[3rem] blur-2xl opacity-40" />
             <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[3.5rem] overflow-hidden border-8 border-[#09090b] shadow-2xl bg-[#121214]">
                <img 
                  src={creator.avatar_url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={creator.full_name} 
                />
             </div>
             {/* Trending Badge Overlay */}
             <div className="absolute top-6 -right-4 bg-gradient-to-r from-orange-400 to-red-500 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/20 transform rotate-12">
                <TrendingUp size={16} className="text-white" />
                <span className="text-xs font-black text-white italic">HOT</span>
             </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 lg:pt-16">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">{creator.full_name}</h1>
              <CheckCircle size={32} className="text-cyan-400 flex-shrink-0" />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center mb-8">
               <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-bold text-gray-400 tracking-wide">
                  @{creator.instagram}
               </span>
               <div className="h-4 w-px bg-white/20" />
               <div className="flex items-center gap-2 text-cyan-400 font-bold bg-cyan-400/10 px-4 py-1.5 rounded-full text-sm">
                  <Star size={16} className="fill-cyan-400" />
                  {creator.rating} Rating
               </div>
               <div className="h-4 w-px bg-white/20" />
               <div className="flex items-center gap-2 text-gray-400 font-bold bg-white/5 px-4 py-1.5 rounded-full text-sm">
                  <MapPin size={16} />
                  {creator.location}
               </div>
            </div>

            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl italic">
              "{creator.bio}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 mb-12">
               <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                  <p className="text-xs text-gray-600 font-black uppercase tracking-[0.2em] mb-2 leading-none">Reach</p>
                  <p className="text-3xl font-black text-white">
                    {creator.follower_count >= 1000000 
                      ? `${(creator.follower_count / 1000000).toFixed(1)}M` 
                      : `${(creator.follower_count / 1000).toFixed(0)}K`}
                  </p>
               </div>
               <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                  <p className="text-xs text-gray-600 font-black uppercase tracking-[0.2em] mb-2 leading-none">Avg. Cost</p>
                  <p className="text-3xl font-black text-cyan-400">
                    ${creator.rate_per_post >= 1000 
                       ? `${(creator.rate_per_post/1000).toFixed(0)}k` 
                       : creator.rate_per_post}
                  </p>
               </div>
               <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hidden sm:block">
                  <p className="text-xs text-gray-600 font-black uppercase tracking-[0.2em] mb-2 leading-none">Reviews</p>
                  <p className="text-3xl font-black text-white">{creator.reviews}+</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={() => navigate('/deals')}
                 className="flex-1 bg-white text-black font-black text-lg py-5 rounded-[2rem] hover:scale-[1.02] transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
               >
                 Send Request
               </button>
               <button className="px-8 py-5 rounded-[2rem] border-2 border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3">
                 <Mail size={20} />
                 <span className="font-bold">Contact</span>
               </button>
            </div>
          </div>
        </div>

        {/* Portfolio / Niche Modules */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              <div>
                 <h3 className="text-3xl font-black tracking-tight mb-8">Recent Collaborations</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {creator.portfolio.map((p, i) => (
                      <div key={i} className="bg-[#121214] border border-white/5 p-8 rounded-[2.5rem] group hover:border-cyan-500/50 transition-colors shadow-2xl">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-xl font-black italic">{p.brand[0]}</span>
                         </div>
                         <h4 className="text-xl font-bold text-white mb-2">{p.title}</h4>
                         <p className="text-gray-500 font-medium text-sm mb-6">{p.brand}</p>
                         <div className="bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                            <TrendingUp size={14} className="text-cyan-400" />
                            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">{p.result}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h3 className="text-3xl font-black tracking-tight mb-8">Instagram Feed</h3>
                 <div className="grid grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-[#121214] rounded-3xl overflow-hidden border border-white/5 group">
                         <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                            📸
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-12">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                 <h3 className="text-xl font-black tracking-tight mb-8">Platforms</h3>
                 <div className="space-y-4">
                    {creator.platforms.map(p => (
                      <div key={p} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <span className="text-xl">{platformIcon(p)}</span>
                            <span className="font-bold text-gray-300 group-hover:text-white">{p}</span>
                         </div>
                         <ExternalLink size={18} className="text-gray-600 group-hover:text-cyan-400" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                 <h3 className="text-xl font-black tracking-tight mb-8">Niche Focus</h3>
                 <div className="flex flex-wrap gap-2">
                    <span className="bg-cyan-400 text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                       {creator.niche}
                    </span>
                    {creator.tags.map(t => (
                      <span key={t} className="bg-white/5 border border-white/10 text-gray-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none hover:text-white hover:border-white transition-colors">
                         {t}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
