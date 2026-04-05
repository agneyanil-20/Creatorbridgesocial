import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CREATORS } from '../data/mockData';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Star, MessageSquare, BadgeCheck, X, Users, ArrowRight } from 'lucide-react';

const ALL_NICHES = ['All', ...NICHES];
const ALL_PLATFORMS = ['All', ...PLATFORMS];

function CreatorCard({ creator, onView }) {
  const icon = NICHE_ICONS[creator.niche] || '🎯';
  return (
    <div 
      className="bg-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2 transition-all duration-500 border border-gray-100 group cursor-pointer"
      onClick={() => onView(creator.id)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={creator.avatar_url}
          alt={creator.full_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-gray-900 text-sm font-bold shadow-xl">
          <span>{icon}</span>
          <span className="line-clamp-1">{creator.niche}</span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1 text-gray-900 shadow-xl">
          <Star size={14} className="text-orange-400 fill-orange-400" />
          <span className="font-bold text-sm">{creator.rating}</span>
        </div>
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-[#6C3EF6] transition-colors">{creator.full_name}</h3>
          <BadgeCheck size={18} className="text-[#6C3EF6]" />
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed italic">
          "{creator.bio}"
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Followers</p>
            <p className="text-gray-900 font-extrabold text-lg">
              {creator.follower_count >= 1000000 
                ? `${(creator.follower_count / 1000000).toFixed(1)}M` 
                : `${(creator.follower_count / 1000).toFixed(0)}K`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Est. Rate</p>
            <p className="text-[#6C3EF6] font-extrabold text-lg">
              ${creator.rate_per_post >= 1000 ? `${(creator.rate_per_post/1000).toFixed(0)}k` : creator.rate_per_post}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Creators() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('All');
  const [platform, setPlatform] = useState('All');

  const filtered = MOCK_CREATORS.filter(c => {
    const matchSearch = c.full_name.toLowerCase().includes(search.toLowerCase()) || 
                       (c.bio || '').toLowerCase().includes(search.toLowerCase());
    const matchNiche = niche === 'All' || c.niche === niche;
    const matchPlatform = platform === 'All' || c.platforms.includes(platform);
    return matchSearch && matchNiche && matchPlatform;
  });

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-[#6C3EF6] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Users size={12} /> Creator Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Discover Top <br className="hidden md:block" />Creative Talent
          </h1>
          <p className="text-gray-500 text-lg max-w-xl font-medium">
            Browse and connect with verified creators across all platforms and niches.
          </p>
        </div>

        {/* Niche Filter - Scrollable on Mobile */}
        <div className="relative mb-10">
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth -mx-6 px-6 sm:mx-0 sm:px-0">
            {ALL_NICHES.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                  niche === n 
                    ? 'bg-[#6C3EF6] text-white border-[#6C3EF6] shadow-xl shadow-purple-200' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'
                }`}
              >
                {n !== 'All' && <span className="text-lg leading-none">{NICHE_ICONS[n]}</span>}
                {n}
              </button>
            ))}
          </div>
          <div className="md:hidden absolute -right-6 top-0 bottom-4 w-12 bg-gradient-to-l from-[#fafbff] to-transparent pointer-events-none" />
        </div>

        {/* Search & Platforms */}
        <div className="glass-morphism rounded-[2.5rem] p-4 mb-12 shadow-sm border border-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by name, expertise or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50/50 pl-16 pr-6 py-5 rounded-[1.5rem] text-sm font-medium focus:bg-white outline-none focus:ring-4 focus:ring-purple-100 transition-all border-0"
              />
            </div>
            <select 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className="px-8 py-5 rounded-[1.5rem] bg-gray-50/50 font-bold text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all border-0 appearance-none min-w-[180px] cursor-pointer text-sm"
            >
              {ALL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm font-bold text-gray-900">{filtered.length} Creators available</p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(c => (
              <CreatorCard key={c.id} creator={c} onView={(id) => navigate(`/profile/${id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <Users size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No creators found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any creators matching your current filters. Try expanding your search.</p>
            <button 
              onClick={() => { setSearch(''); setNiche('All'); setPlatform('All'); }}
              className="mt-8 bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              <X size={16} /> Clear all filters
            </button>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}} />
    </div>
  );
}
