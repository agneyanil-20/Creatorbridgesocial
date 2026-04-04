import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Briefcase, LayoutDashboard, Users, Megaphone, CreditCard, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user?.role === 'business'
    ? [
        { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { to: '/creators', icon: <Users size={16} />, label: 'Find Creators' },
        { to: '/deals', icon: <Briefcase size={16} />, label: 'Deals' },
        { to: '/payments', icon: <CreditCard size={16} />, label: 'Payments' },
      ]
    : user?.role === 'creator'
    ? [
        { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { to: '/campaigns', icon: <Megaphone size={16} />, label: 'Campaigns' },
        { to: '/deals', icon: <Briefcase size={16} />, label: 'My Deals' },
        { to: '/payments', icon: <CreditCard size={16} />, label: 'Earnings' },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3EF6] to-[#a282fb] flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#6C3EF6] to-[#a282fb] bg-clip-text text-transparent">
            CreatorBridge
          </span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-[#6C3EF6] hover:bg-purple-50 transition-all"
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full border-2 border-purple-100" />
                <span className="text-sm font-medium text-gray-700">{user.full_name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
                Log in
              </Link>
              <Link to="/signup" className="bg-[#6C3EF6] hover:bg-[#5B33D1] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-purple-200">
                Sign up free
              </Link>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && user && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-[#6C3EF6] hover:bg-purple-50 transition-all"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
