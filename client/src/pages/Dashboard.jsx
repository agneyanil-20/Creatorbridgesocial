import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DEALS, MOCK_CAMPAIGNS } from '../data/mockData';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Briefcase, 
  Video,
  ArrowRight,
  UserEdit,
  ExternalLink,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isBusiness = user?.role === 'business';
  
  const stats = isBusiness ? [
    { label: 'Active Campaigns', value: '3', icon: <TrendingUp size={20} />, color: 'bg-blue-500' },
    { label: 'Proposals Received', value: '12', icon: <Plus size={20} />, color: 'bg-purple-500' },
    { label: 'Creators Contacted', value: '8', icon: <CheckCircle2 size={20} />, color: 'bg-green-500' },
  ] : [
    { label: 'Active Deals', value: '4', icon: <TrendingUp size={20} />, color: 'bg-orange-500' },
    { label: 'Total Earnings', value: '$12,400', icon: <Plus size={20} />, color: 'bg-green-500' },
    { label: 'Profile Views', value: '1.2k', icon: <CheckCircle2 size={20} />, color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbff] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-500 font-medium mt-1">Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            {isBusiness ? (
              <button 
                onClick={() => navigate('/campaigns/new')}
                className="bg-[#6C3EF6] hover:bg-[#5B33D1] text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-100"
              >
                <Plus size={18} /> Create Campaign
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/profile/${user?.id}`)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg"
              >
                <ExternalLink size={18} /> View My Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-gray-100`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Focused Content */}
          <div className="lg:col-span-2 space-y-10">
            {isBusiness ? (
              /* Business Primary: Find Creators */
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Users size={120} className="text-[#6C3EF6]" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-[#6C3EF6] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Marketplace
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Discover Top <br />Creator Talent</h2>
                  <p className="text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
                    Connect with thousands of verified creators across Tech, Fashion, Gaming, and more.
                  </p>
                  <button 
                    onClick={() => navigate('/creators')}
                    className="bg-[#6C3EF6] hover:bg-[#5B33D1] text-white px-8 py-4 rounded-[1.5rem] font-black transition-all flex items-center gap-3 shadow-xl shadow-purple-100 active:scale-[0.98]"
                  >
                    Browse Creators <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              /* Creator Primary: Active Deals */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Active Deals</h3>
                  <button onClick={() => navigate('/deals')} className="text-sm text-[#6C3EF6] font-bold hover:underline">View all</button>
                </div>
                <div className="space-y-4">
                  {MOCK_DEALS.map(deal => (
                    <div key={deal.id} className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                          <img src={deal.business_logo} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg leading-tight">{deal.campaign.title}</p>
                          <p className="text-sm text-gray-400 font-medium">{deal.business_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-lg">${deal.offer_amount.toLocaleString()}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full inline-block mt-2">
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Section: Recent Activity / Feed */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="bg-white rounded-[2rem] border border-gray-100 p-2 overflow-hidden shadow-sm">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className={`p-6 flex items-center gap-4 ${i !== 2 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {isBusiness ? 'Alex Rivera sent a proposal' : 'Nike Digital sent a campaign request'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            {/* Quick Actions / Profile Mini */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gray-50 overflow-hidden mx-auto mb-6">
                <img src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}&backgroundColor=6C3EF6&textColor=ffffff`} alt="" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{user?.full_name}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Verified {user?.role}</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-600 transition-all flex items-center justify-center gap-2"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Featured Section */}
            <div className="bg-gradient-to-br from-[#6C3EF6] to-[#5B33D1] rounded-[2rem] p-8 text-white shadow-xl shadow-purple-200/50 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
                <TrendingUp size={160} />
              </div>
              <h4 className="text-lg font-black tracking-tight mb-3">Marketplace Tips</h4>
              <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                Complete your profile bio to increase your visibility by up to 40%.
              </p>
              <button className="text-xs font-black uppercase tracking-widest bg-white text-[#6C3EF6] px-5 py-3 rounded-xl hover:scale-105 transition-transform">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
