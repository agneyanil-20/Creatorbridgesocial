import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CREATORS } from '../data/mockData';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Star, MapPin, Users, X, BadgeCheck, ExternalLink } from 'lucide-react';

const ALL_NICHES = ['All', ...NICHES];
const ALL_PLATFORMS = ['All', ...PLATFORMS];

function CreatorCard({ creator, onView }) {
  const icon = NICHE_ICONS[creator.niche] || '🎯';
  return (
    <div 
      className="bg-[#121214] rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-500 border border-white/5 group"
      onClick={() => onView(creator.id)}
    >
      {/* Large Image Holder Box */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1c]">
        <img
          src={creator.avatar_url}
          alt={creator.full_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Niche Badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-white text-sm font-bold shadow-2xl">
          <span>{icon}</span>
          <span>{creator.niche}</span>
        </div>
        {/* Rating Overlay */}
        <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1 text-white shadow-2xl">
          <Star size={14} className="text-orange-400 fill-orange-400" />
          <span className="font-bold text-sm">{creator.rating}</span>
        </div>
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xl font-bold text-white tracking-tight">{creator.full_name}</h3>
          <BadgeCheck size={18} className="text-cyan-400" />
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
          {creator.bio}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Followers</p>
            <p className="text-white font-black text-lg">
              {creator.follower_count >= 1000000 
                ? `${(creator.follower_count / 1000000).toFixed(1)}M` 
                : `${(creator.follower_count / 1000).toFixed(0)}K`}
            </p>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Est. Rate</p>
            <p className="text-cyan-400 font-black text-lg">
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
                       c.bio.toLowerCase().includes(search.toLowerCase()) || 
                       c.niche.toLowerCase().includes(search.toLowerCase());
    const matchNiche = niche === 'All' || c.niche === niche;
    const matchPlatform = platform === 'All' || c.platforms.includes(platform);
    return matchSearch && matchNiche && matchPlatform;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
              Discover <br />Talent
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Connect with top-tier creators across healthcare, tech, and fashion.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             {ALL_NICHES.slice(0, 5).map(n => (
               <button
                 key={n}
                 onClick={() => setNiche(n)}
                 className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                   niche === n 
                     ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                     : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                 }`}
               >
                 {n}
               </button>
             ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-[#121214] border border-white/10 rounded-[2rem] p-2 focus-within:border-cyan-500/50 transition-all">
             <div className="pl-6 pr-4">
                <Search size={24} className="text-gray-500" />
             </div>
             <input 
                type="text"
                placeholder="Search by name, niche or expertise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent w-full py-4 text-lg outline-none text-white placeholder:text-gray-600"
             />
             <div className="pr-2">
                <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 border border-white/5">
                   {filtered.length} Creators
                </div>
             </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <CreatorCard key={c.id} creator={c} onView={(id) => navigate(`/profile/${id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#121214] rounded-[3rem] border border-dashed border-white/10">
            <Users size={64} className="mx-auto text-gray-800 mb-6" />
            <p className="text-xl text-gray-500 font-medium">No talent found matching your criteria</p>
            <button 
              onClick={() => { setSearch(''); setNiche('All'); }}
              className="mt-6 text-cyan-400 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
