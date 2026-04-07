import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { supabase } from '../lib/supabaseClient';
import { 
  User, 
  MapPin, 
  Link as LinkIcon, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  ExternalLink,
  MessageCircle,
  Video,
  Award,
  CheckCircle2
} from 'lucide-react';
import { Button, LoadingPage, Alert } from '../components/Common';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetchProfile();
    setProfile(currentUser);
  }, [id, currentUser]);

  /*
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) {
        setProfile(data);
      } else {
        setError("Profile not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  */

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-12 text-center"><Alert message={error} /></div>;

  const isOwnProfile = currentUser?.id === profile?.id;
  const isBusiness = profile?.role === 'business';

  return (
    <div className="min-h-screen bg-[#fafbff] pb-20">
      {/* Header / Cover Area */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-[#6C3EF6] to-[#a282fb] relative">
        <div className="absolute -bottom-16 left-6 md:left-12">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl overflow-hidden relative">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}&backgroundColor=6C3EF6&textColor=ffffff`} 
                alt={profile?.full_name}
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-2xl shadow-lg border border-gray-50">
              <div className="bg-emerald-500 w-5 h-5 rounded-full border-4 border-white"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-[#6C3EF6] rounded-2xl text-xs font-black uppercase tracking-[0.2em] mb-4">
                  {isBusiness ? <Briefcase size={14} /> : <Video size={14} />}
                  {isBusiness ? 'Business Expert' : 'Professional Creator'}
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{profile?.full_name}</h1>
                <p className="text-gray-400 font-bold text-sm">@{profile?.username || 'user'}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin size={18} className="text-gray-300" />
                  <span className="text-sm font-semibold">Global / Multi-Region</span>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                {isOwnProfile ? (
                  <p className="text-sm font-bold text-gray-400 text-center py-4 bg-gray-50 rounded-2xl">
                    Profile controls are available in account settings.
                  </p>
                ) : (
                  <>
                    <Button className="w-full h-14 rounded-2xl">
                      <Mail size={18} /> Contact {isBusiness ? 'Brand' : 'Creator'}
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl">
                      <MessageCircle size={18} /> Send Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-xl">
              <ShieldCheck className="text-emerald-400 mb-4" size={32} />
              <h4 className="text-lg font-black mb-2">Verified Identity</h4>
              <p className="text-gray-400 text-xs font-medium leading-relaxed">
                This account has verified their identity and linked social platforms manually.
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Award size={22} className="text-[#6C3EF6]" />
                Professional Identity
              </h3>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
                <div className="mb-10">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">About the {isBusiness ? 'Business' : 'Creator'}</h4>
                  <p className="text-gray-600 font-medium leading-loose">
                    {profile?.bio || "No biography provided yet. This user is a verified member of the CreatorBridge marketplace."}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Role Type</p>
                    <p className="text-sm font-black text-gray-900">{isBusiness ? 'Strategic Partner' : 'Creative Talent'}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Focus Area</p>
                    <p className="text-sm font-black text-gray-900">{profile?.niche || 'Generalist'}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl col-span-2 md:col-span-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Trust Rating</p>
                    <p className="text-sm font-black text-emerald-600">High Reliability</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Section Placeholder */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <ExternalLink size={22} className="text-[#6C3EF6]" />
                Showcase & Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center group hover:border-[#6C3EF6] transition-all">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-50 transition-colors">
                      <Briefcase size={24} className="text-gray-300 group-hover:text-[#6C3EF6]" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Project Portfolio</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
