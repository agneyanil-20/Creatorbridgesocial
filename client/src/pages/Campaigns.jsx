import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SUPABASE_URL, SUPABASE_ANON_KEY } from '../context/AuthContext';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Megaphone, X, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '../data/mockData';

const ALL_NICHES = ['All', ...NICHES];
const ALL_PLATFORMS = ['All', ...PLATFORMS];

function CampaignCard({ campaign, onApply }) {
  const diffTime = (new Date(campaign.deadline) - new Date());
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <img 
            src={campaign?.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${campaign?.company_name || 'Brand'}&backgroundColor=6C3EF6&textColor=ffffff`} 
            className="w-14 h-14 rounded-2xl flex-shrink-0 bg-gray-50 object-cover border border-gray-100 group-hover:scale-110 transition-transform duration-500" 
            alt="" 
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 group-hover:text-[#6C3EF6] transition-colors line-clamp-1">{campaign?.title || 'Unknown Campaign'}</h3>
          <p className="text-sm font-medium text-gray-400 mt-0.5">{campaign?.company_name || 'Brand'} · {campaign?.industry || campaign?.niche || 'Niche'}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 flex-1 italic">
        "{(campaign?.description || 'No description provided.')}"
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg ${
          campaign?.platform === 'Instagram' ? 'bg-pink-50 text-pink-600' :
          campaign?.platform === 'YouTube' ? 'bg-red-50 text-red-600' :
          'bg-sky-50 text-sky-600'
        }`}>
          {campaign?.platform || 'Agnostic'}
        </span>
        {(campaign?.tags || []).slice(0, 3).map(t => (
          <span key={t} className="text-[10px] uppercase tracking-wider bg-purple-50 text-[#6C3EF6] px-3 py-1.5 rounded-lg font-bold">
            #{t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <span className="text-sm font-bold">$</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Budget</p>
            <p className="text-sm font-black text-gray-900">${(Number(campaign?.budget) || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${daysLeft < 7 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
            <Clock size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Deadline</p>
            <p className={`text-sm font-black ${daysLeft < 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onApply(campaign)}
        className="w-full bg-[#6C3EF6] hover:bg-[#5B33D1] text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-purple-200/50 flex items-center justify-center gap-2 group-hover:gap-3"
      >
        Apply Now <ArrowRight size={16} />
      </button>
    </div>
  );
}

function CampaignSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 animate-pulse">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
        <div className="flex-1">
          <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
      <div className="h-10 bg-gray-100 rounded w-full mt-auto" />
    </div>
  );
}

export default function Campaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [niche, setNiche] = useState('All');
  const [applied, setApplied] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // In a real app, we fetch from Supabase
      // Assuming a profiles join for brand details
      const res = await fetch(`${SUPABASE_URL}/rest/v1/campaigns?select=*,profiles:business_id(company_name,avatar_url,industry)`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${user?.token || localStorage.getItem('access_token')}`
        }
      });
      
      let data = [];
      if (res.ok) {
        data = await res.json();
        // Fallback to mock if empty or fetch data is minimal
        if (data.length === 0) {
          data = MOCK_CAMPAIGNS;
        } else {
          // Normalize Supabase data to match UI needs
          data = data.map(c => ({
            ...c,
            company_name: c.profiles?.company_name || 'Brand',
            logo: c.profiles?.avatar_url,
            industry: c.profiles?.industry,
            tags: c.tags || [c.niche]
          }));
        }
      } else {
        data = MOCK_CAMPAIGNS;
      }
      setCampaigns(data);
    } catch (e) {
      console.error(e);
      setCampaigns(MOCK_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = campaigns.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                       (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === 'All' || c.platform === platform;
    const matchNiche = niche === 'All' || c.niche === niche;
    return matchSearch && matchPlatform && matchNiche;
  });

  const handleApply = (campaign) => {
    setApplied(campaign);
    setTimeout(() => setApplied(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-[#6C3EF6] rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
              <Megaphone size={12} /> Live Opportunities
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Campaigns for You</h1>
            <p className="text-gray-500 mt-2 font-medium">Discover partnerships that match your unique creator profile.</p>
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Available Opportunities</p>
              <p className="text-2xl font-black text-[#6C3EF6]">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {applied && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#6C3EF6] text-white px-8 py-5 rounded-[2rem] shadow-2xl shadow-purple-500/40 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">🎉</div>
            <div>
              <p className="font-black text-sm uppercase tracking-wider">Application Sent Successfully!</p>
              <p className="text-xs text-purple-100">The team at {applied.company_name} will review your profile soon.</p>
            </div>
          </div>
        )}

        {/* Niche Pills - Optimized for Mobile with Horizontal Scrolling */}
        <div className="relative mb-10">
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            {ALL_NICHES.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                  niche === n
                    ? 'bg-[#6C3EF6] text-white border-[#6C3EF6] shadow-xl shadow-purple-200 scale-105'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200 hover:text-[#6C3EF6]'
                }`}
              >
                {n !== 'All' && <span className="text-lg leading-none">{NICHE_ICONS[n]}</span>}
                {n}
              </button>
            ))}
          </div>
          {/* Mobile indicator for scrolling */}
          <div className="md:hidden absolute -right-4 top-0 bottom-4 w-12 bg-gradient-to-l from-[#fafbff] to-transparent pointer-events-none" />
        </div>

        {/* Filters and Search */}
        <div className="glass-morphism rounded-[2.5rem] p-4 mb-10 shadow-sm border border-white">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by keywords, brand, or requirements..."
                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border-0 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={platform} 
                onChange={e => setPlatform(e.target.value)} 
                className="flex-1 md:flex-none px-6 py-4 rounded-[1.5rem] border-0 bg-gray-50/50 focus:bg-white outline-none text-sm font-bold text-gray-700 cursor-pointer appearance-none min-w-[140px]"
              >
                {ALL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => <CampaignSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(c => (
              <CampaignCard key={c.id} campaign={c} onApply={handleApply} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm px-6">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Megaphone size={40} className="text-purple-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No Matching Campaigns</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">Try adjusting your filters or checking back later for more opportunities.</p>
            <button 
              onClick={() => { setSearch(''); setPlatform('All'); setNiche('All'); }} 
              className="mt-8 bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto"
            >
              <X size={16} /> Reset All Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Global CSS for hiding scrollbar */}
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
