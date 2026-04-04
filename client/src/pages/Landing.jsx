import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Star, Users, TrendingUp, MessageCircle, ChevronRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: <Zap size={22} className="text-[#6C3EF6]" />, title: 'Instant Matching', desc: 'AI-powered matching connects brands with the perfect creators in seconds.' },
  { icon: <Shield size={22} className="text-[#6C3EF6]" />, title: 'Secure Escrow', desc: 'Stripe-powered escrow protects both parties — payment on delivery.' },
  { icon: <MessageCircle size={22} className="text-[#6C3EF6]" />, title: 'Real-time Chat', desc: 'Built-in messaging keeps all your collaboration communication in one place.' },
  { icon: <Star size={22} className="text-[#6C3EF6]" />, title: 'Verified Reviews', desc: 'Transparent ratings and reviews help build trust across the platform.' },
];

const STATS = [
  { value: '12,400+', label: 'Creators Active' },
  { value: '$4.2M', label: 'Paid Out' },
  { value: '3,800+', label: 'Campaigns Run' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const HOW_IT_WORKS_BUSINESS = [
  { step: '01', title: 'Post a Campaign', desc: 'Describe your brand, goals, and budget. Takes just 3 minutes.' },
  { step: '02', title: 'Discover Creators', desc: 'Browse our curated marketplace and send collaboration requests.' },
  { step: '03', title: 'Collaborate & Pay', desc: 'Chat, agree on terms, and release secure payments on completion.' },
];

const HOW_IT_WORKS_CREATOR = [
  { step: '01', title: 'Build Your Profile', desc: 'Showcase your niche, stats, and past work to stand out.' },
  { step: '02', title: 'Browse Campaigns', desc: "Find brand deals that match your audience and apply in one click." },
  { step: '03', title: 'Create & Earn', desc: 'Deliver great content and get paid securely through Stripe.' },
];

const CREATOR_CARDS = [
  { name: 'Alex Rivera', niche: 'Fitness & Lifestyle', followers: '850K', rate: '$3,500', seed: 'AlexR' },
  { name: 'Maya Johnson', niche: 'Beauty & Fashion', followers: '1.2M', rate: '$5,500', seed: 'MayaJ' },
  { name: 'Jordan Kim', niche: 'Tech & Gaming', followers: '620K', rate: '$2,800', seed: 'JordanK' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center font-sans bg-white overflow-hidden">
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
          Find Your Perfect Creator,<br className="hidden md:block" />
          Build Your Brand.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-medium mb-10 leading-relaxed">
          Connect with elite content creators for authentic campaigns, viral growth, and future partnerships.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
            <button
              onClick={() => navigate('/signup?role=business')}
              className="group flex items-center justify-center gap-2 bg-[#0f0f11] hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105 w-full sm:w-auto"
            >
              Join for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/creators')}
              className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-6 py-3.5 rounded-full font-bold text-lg transition-all shadow-sm shadow-gray-100 hover:shadow-md w-full sm:w-auto hover:scale-105"
            >
              <div className="flex -space-x-2">
                <img src="https://api.dicebear.com/7.x/personas/svg?seed=AlexR" className="w-8 h-8 rounded-full border-2 border-white bg-blue-50" alt="" />
                <img src="https://api.dicebear.com/7.x/personas/svg?seed=MayaJ" className="w-8 h-8 rounded-full border-2 border-white bg-pink-50" alt="" />
              </div>
              Explore Creators
            </button>
        </div>

        {/* Liquid Glass Image Container */}
        <div className="relative w-full max-w-5xl mx-auto rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-gray-100 border border-gray-100 group">
           <img src="/hero_image.png" alt="Happy vibrant group of diverse creators" className="w-full h-[400px] md:h-auto object-cover md:max-h-[600px] group-hover:scale-105 transition-transform duration-1000" />
           
           {/* Liquid glass floating elements */}
           <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-4 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-inner">
                 <CheckCircle size={20} className="text-white" />
              </div>
              <div className="text-left">
                  <p className="text-white font-bold text-sm drop-shadow-md">Match Found!</p>
                  <p className="text-white/90 text-xs font-medium drop-shadow-md">Nike x Maya Johnson</p>
              </div>
           </div>

           <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-4 hidden sm:flex items-center gap-4">
              <div className="text-right">
                  <p className="text-white font-black text-2xl drop-shadow-lg">10k+</p>
                  <p className="text-white/90 text-sm font-semibold drop-shadow-md">Active Creators</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center border border-white/50 shadow-inner">
                 <Users size={24} className="text-white drop-shadow-lg" />
              </div>
           </div>
        </div>
      </section>

      {/* Creator preview strip */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Top Creators on the Platform</h2>
            <p className="text-gray-500">Swipe through thousands of verified, top-performing creators</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CREATOR_CARDS.map(c => (
              <div key={c.seed} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${c.seed}`}
                    className="w-14 h-14 rounded-full border-2 border-purple-100"
                    alt={c.name}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-purple-600 font-medium">{c.niche}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Followers</p>
                    <p className="font-bold text-gray-900">{c.followers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Rate / post</p>
                    <p className="font-bold text-[#6C3EF6]">{c.rate}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-5 w-full bg-purple-50 group-hover:bg-[#6C3EF6] group-hover:text-white text-[#6C3EF6] font-semibold py-2.5 rounded-xl transition-all text-sm"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('/login')} className="text-[#6C3EF6] font-semibold hover:underline flex items-center gap-1 mx-auto">
              See 12,400+ creators <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything you need to collaborate</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From discovery to payment, CreatorBridge handles every step of your brand collaboration journey.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-all">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#6C3EF6] text-white text-sm font-bold px-4 py-1.5 rounded-full">For Businesses</div>
              </div>
              <div className="space-y-6">
                {HOW_IT_WORKS_BUSINESS.map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#6C3EF6] text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup?role=business')}
                className="mt-8 bg-[#6C3EF6] hover:bg-[#5B33D1] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-200"
              >
                Start as a Business →
              </button>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gray-900 text-white text-sm font-bold px-4 py-1.5 rounded-full">For Creators</div>
              </div>
              <div className="space-y-6">
                {HOW_IT_WORKS_CREATOR.map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup?role=creator')}
                className="mt-8 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                Join as a Creator →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-gradient-to-r from-[#6C3EF6] to-[#a855f7] py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-4">Ready to Bridge the Gap?</h2>
          <p className="text-purple-100 text-lg mb-8">Join 12,400+ creators and 3,800+ brands already thriving on CreatorBridge.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-[#6C3EF6] font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Try Demo Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0520] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[#6C3EF6]" />
            <span className="text-white font-bold">CreatorBridge</span>
          </div>
          <p className="text-sm">© 2025 CreatorBridge. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
