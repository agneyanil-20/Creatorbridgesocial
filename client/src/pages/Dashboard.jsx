import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DEALS, MOCK_CAMPAIGNS, MOCK_CREATORS } from '../data/mockData';
import { TrendingUp, Briefcase, MessageCircle, Star, Users, Megaphone, DollarSign, CheckCircle, Clock, ChevronRight } from 'lucide-react';

function StatCard({ icon, label, value, color = 'purple' }) {
  const colors = {
    purple: 'bg-purple-50 text-[#6C3EF6]',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function DealStatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-blue-100 text-blue-700',
    paid: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function BusinessDashboard({ user }) {
  const navigate = useNavigate();
  const myDeals = MOCK_DEALS.filter(d => d.business_id === user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#6C3EF6] to-[#a855f7] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-6 top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <h2 className="text-2xl font-black">Good morning, {user.company_name || user.full_name}! 👋</h2>
        <p className="text-purple-100 mt-1 mb-6">You have {myDeals.filter(d => d.status === 'active').length} active deals running.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/creators')} className="bg-white text-[#6C3EF6] font-bold px-5 py-2.5 rounded-full text-sm hover:shadow-lg transition-all">
            Find Creators
          </button>
          <button className="bg-white/20 border border-white/30 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white/30 transition-all">
            Post Campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Briefcase size={18} />} label="Active Deals" value={myDeals.filter(d => d.status === 'active').length} />
        <StatCard icon={<Clock size={18} />} label="Pending Requests" value={myDeals.filter(d => d.status === 'pending').length} color="orange" />
        <StatCard icon={<CheckCircle size={18} />} label="Completed" value={myDeals.filter(d => d.status === 'completed').length} color="green" />
        <StatCard icon={<DollarSign size={18} />} label="Total Spent" value={`$${myDeals.reduce((a, d) => a + d.offer_amount, 0).toLocaleString()}`} color="blue" />
      </div>

      {/* Recent Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Deals</h3>
          <button onClick={() => navigate('/deals')} className="text-sm text-[#6C3EF6] font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {myDeals.map(deal => (
            <div
              key={deal.id}
              onClick={() => deal.status === 'active' && navigate(`/messages/${deal.id}`)}
              className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 transition-all ${
                deal.status === 'active' ? 'hover:shadow-md hover:border-purple-100 cursor-pointer group' : 'opacity-80'
              }`}
            >
              <img src={deal.creator_avatar} className="w-12 h-12 rounded-xl border border-gray-100" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{deal.creator_name}</p>
                <p className="text-sm text-gray-500 truncate">{deal.campaign?.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-gray-900">${deal.offer_amount.toLocaleString()}</p>
                <DealStatusBadge status={deal.status} />
                {deal.status === 'active' && <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
              </div>
            </div>
          ))}
          {myDeals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">No deals yet. <button onClick={() => navigate('/creators')} className="text-[#6C3EF6] font-semibold hover:underline">Find creators</button></p>
            </div>
          )}
        </div>
      </div>

      {/* Top Creators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recommended Creators</h3>
          <button onClick={() => navigate('/creators')} className="text-sm text-[#6C3EF6] font-semibold hover:underline flex items-center gap-1">
            Browse all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_CREATORS.slice(0, 3).map(c => (
            <div key={c.id} onClick={() => navigate(`/profile/${c.id}`)} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-purple-100 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <img src={c.avatar_url} className="w-11 h-11 rounded-xl" alt="" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{c.full_name}</p>
                  <p className="text-xs text-purple-600">{c.niche}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Followers</p>
                  <p className="font-bold text-gray-900">
                    {c.follower_count >= 1000000
                      ? `${(c.follower_count / 1000000).toFixed(1)}M`
                      : `${(c.follower_count / 1000).toFixed(0)}K`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Rate / Post</p>
                  <p className="font-bold text-[#6C3EF6]">${c.rate_per_post.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Rating</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{c.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorDashboard({ user }) {
  const navigate = useNavigate();
  const myDeals = MOCK_DEALS.filter(d => d.creator_id === user.id);
  const totalEarned = myDeals.filter(d => d.status === 'paid').reduce((a, d) => a + d.offer_amount * 0.9, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-6 top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="flex items-start gap-4">
          <img src={user.avatar_url} className="w-14 h-14 rounded-2xl border-2 border-white/20" alt="" />
          <div>
            <h2 className="text-2xl font-black">Hey, {user.full_name}! ✨</h2>
            <p className="text-gray-300 mt-1">You have {myDeals.filter(d => d.status === 'pending').length} pending request{myDeals.filter(d => d.status === 'pending').length !== 1 ? 's' : ''} waiting.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => navigate('/campaigns')} className="bg-white text-gray-900 font-bold px-5 py-2.5 rounded-full text-sm hover:shadow-lg transition-all">
            Browse Campaigns
          </button>
          <button onClick={() => navigate(`/profile/${user.id}`)} className="bg-white/10 border border-white/20 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-white/20 transition-all">
            View My Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Briefcase size={18} />} label="Active Deals" value={myDeals.filter(d => d.status === 'active').length} />
        <StatCard icon={<Clock size={18} />} label="Pending" value={myDeals.filter(d => d.status === 'pending').length} color="orange" />
        <StatCard icon={<CheckCircle size={18} />} label="Completed" value={myDeals.filter(d => d.status === 'completed').length} color="green" />
        <StatCard icon={<DollarSign size={18} />} label="Total Earned" value={`$${totalEarned.toLocaleString()}`} color="blue" />
      </div>

      {/* Incoming Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Your Deals</h3>
          <button onClick={() => navigate('/deals')} className="text-sm text-[#6C3EF6] font-semibold hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>
        {myDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No deals yet. <button onClick={() => navigate('/campaigns')} className="text-[#6C3EF6] font-semibold hover:underline">Browse campaigns</button></p>
          </div>
        ) : (
          <div className="space-y-3">
            {myDeals.map(deal => (
              <div
                key={deal.id}
                onClick={() => deal.status === 'active' && navigate(`/messages/${deal.id}`)}
                className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 transition-all ${
                  deal.status === 'active' ? 'hover:shadow-md hover:border-purple-100 cursor-pointer group' : 'opacity-80'
                }`}
              >
                <img src={deal.business_logo} className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{deal.business_name}</p>
                  <p className="text-sm text-gray-500 truncate">{deal.campaign?.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-gray-900">${(deal.offer_amount * 0.9).toLocaleString()}</p>
                  <DealStatusBadge status={deal.status} />
                  {deal.status === 'active' && <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaigns to apply */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Open Campaigns for You</h3>
          <button onClick={() => navigate('/campaigns')} className="text-sm text-[#6C3EF6] font-semibold hover:underline flex items-center gap-1">
            Browse all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(MOCK_CAMPAIGNS || []).slice(0, 2).map(c => (
            <div key={c?.id} onClick={() => navigate('/campaigns')} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-purple-100 transition-all cursor-pointer group">
              <div className="flex items-start gap-3 mb-3">
                <img src={c?.logo} className="w-10 h-10 rounded-xl" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{c?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c?.company_name}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-green-600">${(c?.budget)?.toLocaleString()} budget</span>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">{c?.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'business' ? <BusinessDashboard user={user} /> : <CreatorDashboard user={user} />}
      </div>
    </div>
  );
}
