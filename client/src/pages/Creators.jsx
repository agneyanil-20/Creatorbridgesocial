import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CREATORS } from '../data/mockData';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Star, MapPin, Users, X, BadgeCheck, Bookmark, Mail } from 'lucide-react';

const ALL_NICHES = ['All', ...NICHES];
const ALL_PLATFORMS = ['All', ...PLATFORMS];

function CreatorCard({ creator, onView }) {
  const icon = NICHE_ICONS[creator.niche] || '🎯';
  return (
    <div 
      className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-[3/4] hover:-translate-y-2 transition-all duration-500 shadow-xl border border-gray-100"
      onClick={() => onView(creator.id)}
    >
      {/* Background Image */}
      <img
        src={creator.avatar_url}
        alt={creator.full_name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent opacity-90" />
      
      {/* Niche tag - Top Left */}
      <div className="absolute top-5 left-5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 z-10 text-white shadow-xl">
        <span>{icon}</span>
        <span className="text-xs font-semibold">{creator.niche}</span>
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-20">
        {/* Name and Verified */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-extrabold text-white tracking-tight">{creator.full_name}</h3>
          <BadgeCheck size={18} className="text-blue-500 bg-white rounded-full border-2 border-white" />
        </div>
        
        {/* Bio */}
        <p className="text-sm text-gray-300 line-clamp-2 mb-6 leading-relaxed font-light">
          {creator.bio}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between py-4 border-t border-white/10 mb-5">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-orange-400 fill-orange-400" />
              <span className="text-white font-bold">{creator.rating}</span>
            </div>
            <span className="text-xs text-gray-400 mt-1.5 tracking-wide">Rating</span>
          </div>
          
          <div className="w-px h-8 bg-white/10" />
          
          <div className="flex flex-col items-center">
             <span className="text-white font-bold">
               {creator.follower_count >= 1000000 
                  ? `${(creator.follower_count / 1000000).toFixed(1)}M+` 
                  : `${(creator.follower_count / 1000).toFixed(0)}K+`}
             </span>
             <span className="text-xs text-gray-400 mt-1.5 tracking-wide">Followers</span>
          </div>
          
          <div className="w-px h-8 bg-white/10" />
          
          <div className="flex flex-col items-center">
             <span className="text-white font-bold">${creator.rate_per_post >= 1000 ? `${(creator.rate_per_post/1000).toFixed(0)}k` : creator.rate_per_post}</span>
             <span className="text-xs text-gray-400 mt-1.5 tracking-wide">/ Post</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onView(creator.id); }}
            className="flex-1 relative group overflow-hidden rounded-full py-3.5 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02] transition-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2 text-white font-bold">
               <Mail size={16} /> Get In Touch
            </div>
          </button>
          <button 
            className="w-[52px] h-[52px] rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all flex-shrink-0 text-white shadow-lg"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Bookmark size={18} />
          </button>
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
  const [maxRate, setMaxRate] = useState(30000);

  const filtered = MOCK_CREATORS.filter(c => {
    const matchSearch = c.full_name.toLowerCase().includes(search.toLowerCase()) || c.bio.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase());
    const matchNiche = niche === 'All' || c.niche === niche;
    const matchPlatform = platform === 'All' || c.platforms.includes(platform);
    const matchRate = c.rate_per_post <= maxRate;
    return matchSearch && matchNiche && matchPlatform && matchRate;
  });

  const clearFilters = () => { setSearch(''); setNiche('All'); setPlatform('All'); setMaxRate(30000); };
  const hasFilters = search || niche !== 'All' || platform !== 'All' || maxRate < 30000;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Discover Creators</h1>
          <p className="text-gray-500 mt-1">Browse {MOCK_CREATORS.length}+ verified content creators across 15 niches</p>
        </div>

        {/* Niche Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALL_NICHES.map(n => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                niche === n
                  ? 'bg-[#6C3EF6] text-white border-[#6C3EF6] shadow-md shadow-purple-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-[#6C3EF6]'
              }`}
            >
              {n !== 'All' && <span>{NICHE_ICONS[n]}</span>}
              {n}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, niche, or keywords..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
              />
            </div>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm text-gray-700 bg-white"
            >
              {ALL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
              Max Rate: <span className="text-[#6C3EF6] font-bold">${maxRate.toLocaleString()}/post</span>
            </label>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={maxRate}
              onChange={e => setMaxRate(Number(e.target.value))}
              className="flex-1 accent-[#6C3EF6]"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} creator{filtered.length !== 1 ? 's' : ''} found
          {niche !== 'All' && <span className="ml-1">in <span className="font-semibold text-[#6C3EF6]">{NICHE_ICONS[niche]} {niche}</span></span>}
        </p>

        {/* Creator Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => (
              <CreatorCard key={c.id} creator={c} onView={(id) => navigate(`/profile/${id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Users size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No creators match your filters.</p>
            <button onClick={clearFilters} className="mt-3 text-[#6C3EF6] text-sm font-semibold hover:underline flex items-center gap-1 mx-auto">
              <X size={14} /> Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
