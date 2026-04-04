import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_PAYMENTS } from '../data/mockData';
import { CreditCard, Shield, TrendingUp, DollarSign, Clock, CheckCircle, ExternalLink, Zap } from 'lucide-react';

function PaymentRow({ payment, role }) {
  const statusMap = {
    in_escrow: { cls: 'bg-yellow-100 text-yellow-700', label: 'In Escrow', icon: <Clock size={12} /> },
    paid: { cls: 'bg-green-100 text-green-700', label: 'Paid Out', icon: <CheckCircle size={12} /> },
  };
  const s = statusMap[payment.status];
  const netAmount = payment.amount - payment.platform_fee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-purple-100 transition-all">
      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <DollarSign size={20} className="text-[#6C3EF6]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900">{role === 'business' ? payment.creator_name : payment.business_name}</p>
        <p className="text-sm text-gray-400">{payment.created_at}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="font-extrabold text-gray-900">${payment.amount.toLocaleString()}</p>
          {role === 'creator' && (
            <p className="text-xs text-gray-400">You receive: <span className="text-green-600 font-bold">${netAmount.toLocaleString()}</span></p>
          )}
          {role === 'business' && (
            <p className="text-xs text-gray-400">Platform fee: <span className="font-medium">${payment.platform_fee}</span></p>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
          {s.icon} {s.label}
        </span>
      </div>
    </div>
  );
}

export default function Payments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const myPayments = MOCK_PAYMENTS.filter(p =>
    user.role === 'business' ? p.business_name === user.company_name : p.creator_name === user.full_name
  );

  const totalPaid = myPayments.filter(p => p.status === 'paid').reduce((a, p) => a + p.amount, 0);
  const inEscrow = myPayments.filter(p => p.status === 'in_escrow').reduce((a, p) => a + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {user.role === 'creator' ? 'My Earnings' : 'Payment History'}
          </h1>
          <p className="text-gray-500 mt-1">Stripe-powered secure payments & escrow</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-gradient-to-br from-[#6C3EF6] to-[#a855f7] text-white rounded-2xl p-6 shadow-lg shadow-purple-200">
            <DollarSign size={22} className="opacity-70 mb-3" />
            <p className="text-3xl font-black">${totalPaid.toLocaleString()}</p>
            <p className="text-purple-100 text-sm mt-1">{user.role === 'creator' ? 'Total Earned' : 'Total Paid'}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <Clock size={22} className="text-yellow-500 mb-3" />
            <p className="text-3xl font-black text-gray-900">${inEscrow.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">In Escrow</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <TrendingUp size={22} className="text-green-500 mb-3" />
            <p className="text-3xl font-black text-gray-900">{myPayments.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total Transactions</p>
          </div>
        </div>

        {/* Stripe Connect Banner */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <CreditCard size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">Stripe {user.role === 'creator' ? 'Connect' : 'Payments'}</p>
                <span className="bg-green-400 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Connected
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-0.5">
                {user.role === 'creator'
                  ? 'Payouts sent automatically when deals are marked complete.'
                  : 'Funds held in escrow until deal completion.'}
              </p>
            </div>
          </div>
          <button className="bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0">
            Stripe Dashboard <ExternalLink size={14} />
          </button>
        </div>

        {/* Commission Info */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Shield size={18} className="text-[#6C3EF6] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-purple-900 mb-1">Platform Commission</p>
            <p className="text-sm text-purple-700">CreatorBridge takes a <strong>10% commission</strong> from each deal. Creators receive 90% of the agreed rate. Commission is deducted automatically via Stripe.</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
          {myPayments.length > 0 ? (
            <div className="space-y-3">
              {myPayments.map(p => (
                <PaymentRow key={p.id} payment={p} role={user.role} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <CreditCard size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No transactions yet.</p>
              <button
                onClick={() => navigate(user.role === 'business' ? '/creators' : '/campaigns')}
                className="mt-4 bg-[#6C3EF6] hover:bg-[#5B33D1] text-white font-bold px-5 py-2.5 rounded-full transition-all text-sm shadow-lg"
              >
                {user.role === 'business' ? 'Find Creators' : 'Browse Campaigns'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
