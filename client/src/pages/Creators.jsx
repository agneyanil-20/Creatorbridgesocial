import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Star, MessageSquare, CheckCircle2, X, Users, ArrowRight, RefreshCw } from 'lucide-react';

const ALL_NICHES = ['All', ...NICHES];

function CreatorCard({ creator, onView }) {
  const icon = NICHE_ICONS[creator.niche] || '🎯';
  // Use avatar_url from DB if available, fallback to Dicebear initials
  const avatar = creator.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${creator.full_name || creator.username}&backgroundColor=6C3EF6&textColor=ffffff`;

  return (
    <div 
      className="bg-white rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-purple-200/40 hover:-translate-y-2 transition-all duration-500 border border-gray-100 group cursor-pointer"
      onClick={() => onView(creator.id)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={avatar}
          alt={creator.full_name || creator.username}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
             e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${creator.username}&backgroundColor=6C3EF6&textColor=ffffff`;
          }}
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-gray-900 text-[10px] font-black uppercase tracking-widest shadow-xl">
          <span>{icon}</span>
          <span className="line-clamp-1">{creator.niche}</span>
        </div>
        <div className="absolute bottom-4 right-4 bg-[#6C3EF6] text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl">
          <Star size={12} className="fill-white" />
          <span className="font-bold text-xs">{creator.rating || '4.9'}</span>
        </div>
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#6C3EF6] transition-colors truncate">
            {creator.full_name || creator.username}
          </h3>
          <CheckCircle2 size={18} className="text-[#6C3EF6] flex-shrink-0" />
        </div>
        <p className="text-[#6C3EF6] text-[11px] font-bold tracking-widest uppercase mb-4 mb-3">
          @{creator.username || creator.full_name?.toLowerCase().replace(' ', '_')}
        </p>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed min-h-[40px]">
          {creator.bio || "No bio provided yet. I'm a passionate creator looking to collaborate on exciting brand projects."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex-1">
             <button 
                onClick={(e) => { e.stopPropagation(); onView(creator.id); }}
                className="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
             >
                View Profile <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Creators() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('All');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreators(data || []);
    } catch (e) {
      console.error('Error fetching creators:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = creators.filter(c => {
    const matchSearch = (c.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
                       (c.username || '').toLowerCase().includes(search.toLowerCase()) ||
                       (c.bio || '').toLowerCase().includes(search.toLowerCase());
    const matchNiche = niche === 'All' || c.niche === niche;
    return matchSearch && matchNiche;
  });

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-[#6C3EF6] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Star size={12} /> Creator Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
              Connect with <br className="hidden md:block" />Verified Talent
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              Browse top-tier creators from around the world and start your next big campaign.
            </p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#6C3EF6]/5 rounded-3xl blur-xl group-focus-within:bg-[#6C3EF6]/10 transition-all" />
              <div className="relative flex items-center bg-white border border-gray-100 p-2 rounded-3xl shadow-sm">
                <Search size={22} className="ml-4 text-gray-300" />
                <input 
                  type="text"
                  placeholder="Search by name or @username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-3 pr-6 py-4 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Niche Filter - Scrollable on Mobile */}
        <div className="relative mb-12">
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth -mx-6 px-6 sm:mx-0 sm:px-0">
            {ALL_NICHES.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                  niche === n 
                    ? 'bg-[#6C3EF6] text-white border-[#6C3EF6] shadow-xl shadow-purple-200' 
                    : 'bg-white text-gray-400 border-gray-50 hover:border-purple-200 hover:text-gray-600 shadow-sm'
                }`}
              >
                {n !== 'All' && <span className="text-lg leading-none">{NICHE_ICONS[n]}</span>}
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] border border-gray-50 p-7 animate-pulse">
                <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] mb-6" />
                <div className="h-6 w-2/3 bg-gray-50 rounded-full mb-3" />
                <div className="h-4 w-1/3 bg-gray-100 rounded-full mb-10" />
                <div className="h-12 w-full bg-gray-50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(c => (
              <CreatorCard key={c.id} creator={c} onView={(id) => navigate(`/profile/${id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
               <Users size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No creators found</h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8">We couldn't find any creators matching your current filters.</p>
            <button 
              onClick={() => { setSearch(''); setNiche('All'); }}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-xl shadow-gray-200"
            >
              <X size={16} /> Clear all filters
            </button>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
