import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CREATORS } from '../data/mockData';
import { Star, MapPin, ArrowLeft, ExternalLink, CheckCircle, Bookmark, MoreHorizontal, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen bg-[#060608] font-sans relative overflow-x-hidden antialiased text-white">
      {/* Immersive Background Image Header */}
      <div className="absolute top-0 inset-x-0 h-[65vh]">
        <img src={creator.avatar_url} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/50 to-transparent" />
      </div>

      {/* Glass Top Nav */}
      <div className="relative z-20 flex justify-between items-center p-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full text-sm font-semibold tracking-wider text-white/90 shadow-lg">
          Profile
        </div>
        <button
          className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow-lg"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-[35vh] pb-24">
        {/* Main Liquid Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-[24px] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-none">{creator.full_name}</h1>
                 <CheckCircle size={22} className="text-cyan-400" />
              </div>
              <p className="text-gray-400 text-[15px] font-medium tracking-wide mt-2">@{creator.instagram || creator.id.split('-')[1]}</p>
            </div>
            
            <button className="bg-white/10 p-3 rounded-full border border-white/10 hover:bg-white/20 transition-colors shadow-lg">
               <Bookmark size={22} className="text-white" />
            </button>
          </div>
          
          <p className="text-gray-300 font-light leading-relaxed mt-6 text-[15px] sm:text-base max-w-[95%]">
            {creator.bio}
          </p>

          {/* Stats Layout matching reference */}
          <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
             <div>
               <p className="text-xl sm:text-[22px] font-bold text-white tracking-wide">
                 {creator.follower_count >= 1000000 ? `${(creator.follower_count / 1000000).toFixed(1)}M` : `${(creator.follower_count / 1000).toFixed(0)}K`}
               </p>
               <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-[0.1em] font-semibold">Followers</p>
             </div>
             <div>
               <p className="text-xl sm:text-[22px] font-bold text-white tracking-wide">
                 {creator.rating}
               </p>
               <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-[0.1em] font-semibold">Rating</p>
             </div>
             <div>
               <p className="text-xl sm:text-[22px] font-bold text-white tracking-wide">
                 ${creator.rate_per_post >= 1000 ? `${(creator.rate_per_post / 1000).toFixed(0)}k` : creator.rate_per_post}
               </p>
               <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-[0.1em] font-semibold">Creations</p>
             </div>
          </div>

          {/* Blue Gradient Action Button */}
          <div className="mt-4">
            <button 
               onClick={() => navigate('/deals')}
               className="w-full relative group overflow-visible"
            >
               {/* Outer glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-[2rem] opacity-40 blur-xl group-hover:opacity-60 transition-opacity" />
               {/* Button face */}
               <div className="relative w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-[2rem] flex items-center justify-center py-4 text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform">
                   Send Request
               </div>
            </button>
          </div>
        </div>

        {/* Secondary Glass Modules below */}
        <div className="mt-6 flex flex-col gap-6">
          <div className="bg-white/[0.03] backdrop-blur-[24px] border border-white/10 rounded-[2rem] p-6 shadow-xl">
             <h3 className="text-white/90 font-semibold mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-cyan-400" />
                Location & Niche
             </h3>
             <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-white/10 text-white/90 text-xs px-4 py-2 border border-white/10 rounded-full font-medium">{creator.location}</span>
                <span className="bg-cyan-500/20 text-cyan-300 text-xs px-4 py-2 border border-cyan-500/30 rounded-full font-medium">{creator.niche}</span>
                {creator.tags?.map(t => (
                  <span key={t} className="bg-white/5 border border-white/10 text-white/70 text-xs px-4 py-2 rounded-full capitalize font-medium">{t}</span>
                ))}
             </div>

             <div className="space-y-3">
                {creator.platforms?.map(p => {
                  const href = p === 'Instagram' && creator.instagram ? `https://www.instagram.com/${creator.instagram}/` : null;
                  const content = (
                    <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg opacity-80">{platformIcon(p)}</span>
                        <span className="text-sm font-semibold text-white/90">{p}</span>
                        {p === 'Instagram' && creator.instagram && (
                          <span className="text-xs text-gray-400">@{creator.instagram}</span>
                        )}
                      </div>
                      <ExternalLink size={14} className={href ? 'text-cyan-400' : 'text-gray-500'} />
                    </div>
                  );
                  return href ? <a key={p} href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <div key={p}>{content}</div>;
                })}
             </div>
          </div>
          
          <div className="bg-white/[0.03] backdrop-blur-[24px] border border-white/10 rounded-[2rem] p-6 shadow-xl">
             <h3 className="text-white/90 font-semibold mb-5 flex items-center gap-2">
                 <TrendingUp size={18} className="text-cyan-400" /> Past Collaborations
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creator.portfolio?.map((p, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-black">{p.brand[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm leading-tight">{p.title}</p>
                        <p className="text-[11px] text-gray-400 tracking-wide uppercase mt-0.5">{p.brand}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Result</span>
                      <span className="text-sm font-bold text-cyan-400">{p.result}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
