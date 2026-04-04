import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DEALS } from '../data/mockData';
import { MessageCircle, Clock, CheckCircle, XCircle, Briefcase, ChevronRight, DollarSign } from 'lucide-react';

function StatusBadge({ status }) {
  const map = {
    active: { cls: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
    pending: { cls: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
    completed: { cls: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} /> },
    paid: { cls: 'bg-purple-100 text-purple-700', icon: <DollarSign size={12} /> },
    rejected: { cls: 'bg-red-100 text-red-700', icon: <XCircle size={12} /> },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${s.cls}`}>
      {s.icon} {status}
    </span>
  );
}

const STATUS_ORDER = ['active', 'pending', 'completed', 'paid', 'rejected'];

export default function Deals() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const myDeals = MOCK_DEALS.filter(d =>
    user?.role === 'business' ? d.business_id === user.id : d.creator_id === user.id
  );

  const grouped = STATUS_ORDER.reduce((acc, s) => {
    const group = myDeals.filter(d => d.status === s);
    if (group.length) acc[s] = group;
    return acc;
  }, {});

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Deals</h1>
          <p className="text-gray-500 mt-1">Track all your collaboration deals in one place</p>
        </div>

        {myDeals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Briefcase size={52} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Deals Yet</h3>
            <p className="text-gray-400 mb-6">
              {user.role === 'business'
                ? 'Browse creators and send your first collaboration request.'
                : 'Browse campaigns and apply to start earning.'}
            </p>
            <button
              onClick={() => navigate(user.role === 'business' ? '/creators' : '/campaigns')}
              className="bg-[#6C3EF6] hover:bg-[#5B33D1] text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg"
            >
              {user.role === 'business' ? 'Find Creators' : 'Browse Campaigns'}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([status, deals]) => (
              <div key={status}>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span>({deals.length})</span>
                </h2>
                <div className="space-y-3">
                  {deals.map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => deal.status === 'active' && navigate(`/messages/${deal.id}`)}
                      className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 transition-all ${
                        deal.status === 'active' ? 'hover:shadow-lg hover:border-purple-100 cursor-pointer group' : ''
                      }`}
                    >
                      <img
                        src={user.role === 'business' ? deal.creator_avatar : deal.business_logo}
                        className="w-14 h-14 rounded-xl border border-gray-100 flex-shrink-0 object-cover bg-gray-50"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">
                          {user.role === 'business' ? deal.creator_name : deal.business_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{deal.campaign?.title}</p>
                        <p className="text-xs text-gray-400 mt-1">"{deal.message}"</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="font-extrabold text-gray-900">${deal.offer_amount.toLocaleString()}</p>
                        <StatusBadge status={deal.status} />
                        {deal.status === 'active' && (
                          <div className="flex items-center gap-1 text-xs text-[#6C3EF6] font-semibold group-hover:gap-2 transition-all">
                            <MessageCircle size={12} /> Chat
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
