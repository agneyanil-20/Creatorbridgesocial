import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DEALS, MOCK_MESSAGES } from '../data/mockData';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Check } from 'lucide-react';

export default function Messages() {
  const { dealId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(MOCK_MESSAGES[dealId] || []);
  const bottomRef = useRef(null);

  const deal = MOCK_DEALS.find(d => d.id === dealId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  if (!user || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Conversation not found</h2>
          <button onClick={() => navigate('/deals')} className="text-[#6C3EF6] font-semibold hover:underline">← Back to Deals</button>
        </div>
      </div>
    );
  }

  const isMe = (senderId) => senderId === user.id;
  const otherName = user.role === 'business' ? deal.creator_name : deal.business_name;
  const otherAvatar = user.role === 'business' ? deal.creator_avatar : deal.business_logo;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: `m${Date.now()}`,
      sender_id: user.id,
      sender_name: user.full_name,
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMsgs(prev => [...prev, newMsg]);
    setInput('');
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate('/deals')} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <img src={otherAvatar} className="w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 object-cover" alt="" />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900">{otherName}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <p className="text-xs text-gray-400">Online · {deal.campaign?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-400">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-400">
            <Video size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-400">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Deal Info Banner */}
      <div className="bg-purple-50 border-b border-purple-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-purple-700">Deal: <span className="font-bold">{deal.campaign?.title}</span></span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${deal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {deal.status}
          </span>
        </div>
        <span className="text-sm font-bold text-purple-700">${deal.offer_amount.toLocaleString()}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        {msgs.map((msg, idx) => {
          const mine = isMe(msg.sender_id);
          const showAvatar = !mine && (idx === 0 || msgs[idx - 1]?.sender_id !== msg.sender_id);
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
              {!mine && (
                <img
                  src={showAvatar ? otherAvatar : undefined}
                  className="w-7 h-7 rounded-lg flex-shrink-0 bg-gray-100"
                  style={{ opacity: showAvatar ? 1 : 0 }}
                  alt=""
                />
              )}
              <div className={`max-w-sm lg:max-w-md ${mine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? 'bg-[#6C3EF6] text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`flex items-center gap-1 text-xs text-gray-400 ${mine ? 'flex-row-reverse' : ''}`}>
                  <span>{formatTime(msg.created_at)}</span>
                  {mine && <Check size={12} className="text-[#6C3EF6]" />}
                </div>
              </div>
              {mine && (
                <img src={user.avatar_url} className="w-7 h-7 rounded-lg flex-shrink-0" alt="" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="bg-white border-t border-gray-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-[#6C3EF6] focus-within:ring-4 focus-within:ring-purple-50 transition-all px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-1"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 bg-[#6C3EF6] hover:bg-[#5B33D1] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
