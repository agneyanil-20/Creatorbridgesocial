import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CAMPAIGNS } from '../data/mockData';
import { NICHES, NICHE_ICONS, PLATFORMS } from '../constants';
import { Search, Megaphone, X } from 'lucide-react';

const ALL_NICHES = ['All', ...NICHES];
const ALL_PLATFORMS = ['All', ...PLATFORMS];

function CampaignCard({ campaign, onApply }) {
  const daysLeft = Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        <img src={campaign.logo} className="w-12 h-12 rounded-xl flex-shrink-0 bg-gray-50" alt="" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 leading-tight group-hover:text-[#6C3EF6] transition-colors">{campaign.title}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{campaign.company_name} · {campaign.industry}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full flex-shrink-0 ${
          campaign.platform === 'Instagram' ? 'bg-pink-50 text-pink-600' :
          campaign.platform === 'YouTube' ? 'bg-red-50 text-red-600' :
          'bg-sky-50 text-sky-600'
        }`}>{campaign.platform}</span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{campaign.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {campaign.tags.map(t => (
          <span key={t} className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">#{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-5">
          <div>
            <p className="text-xs text-gray-400">Budget</p>
            <p className="text-sm font-bold text-green-600">${campaign.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Deadline</p>
            <p className={`text-sm font-bold ${daysLeft < 14 ? 'text-orange-500' : 'text-gray-700'}`}>
              {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Applicants</p>
            <p className="text-sm font-bold text-gray-700">{campaign.applicants}</p>
          </div>
        </div>
        <button
          onClick={() => onApply(campaign)}
          className="bg-[#6C3EF6] hover:bg-[#5B33D1] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-purple-100"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [niche, setNiche] = useState('All');
  const [applied, setApplied] = useState(null);

  const filtered = MOCK_CAMPAIGNS.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === 'All' || c.platform === platform;
    const matchNiche = niche === 'All' || c.niche === niche;
    return matchSearch && matchPlatform && matchNiche;
  });

  const handleApply = (campaign) => {
    setApplied(campaign);
    setTimeout(() => setApplied(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Brand Campaigns</h1>
          <p className="text-gray-500 mt-1">Discover and apply for brand partnerships</p>
        </div>

        {/* Success Toast */}
        {applied && (
          <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <span className="text-lg">🎉</span>
            <div>
              <p className="font-bold text-sm">Application Sent!</p>
              <p className="text-xs text-green-100">{applied.company_name} will be notified.</p>
            </div>
          </div>
        )}

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

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm"
              />
            </div>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6C3EF6] outline-none text-sm text-gray-700 bg-white">
              {ALL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} campaign{filtered.length !== 1 ? 's' : ''} available</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(c => (
              <CampaignCard key={c.id} campaign={c} onApply={handleApply} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Megaphone size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No campaigns match your filters.</p>
            <button onClick={() => { setSearch(''); setPlatform('All'); setNiche('All'); }} className="mt-3 text-[#6C3EF6] text-sm font-semibold hover:underline flex items-center gap-1 mx-auto">
              <X size={14} /> Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
