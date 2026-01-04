
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Don't show navigation on landing pages or if no user is logged in
  if (location.pathname.startsWith('/listing/') || !user) return null;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/leads', label: 'Prospek', icon: 'fa-users' },
    { path: '/properties', label: 'Inventaris', icon: 'fa-building' },
    { path: '/landing-pages', label: 'Landing Pages', icon: 'fa-pager' },
    { path: '/calendar', label: 'Kalender', icon: 'fa-calendar-alt' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <i className="fas fa-home-alt text-white"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none">PropTrack</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Property CRM</span>
              </div>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <i className={`fas ${item.icon} mr-2 text-xs`}></i>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-gray-900">{user.name}</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded inline-block ${user.role === 'Administrator' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                {user.role}
              </div>
            </div>
            
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:border-indigo-500 transition-colors"
            >
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-fadeIn z-[100]">
                <div className="px-4 py-2 border-b border-gray-50 md:hidden">
                  <div className="text-xs font-bold text-gray-900">{user.name}</div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</div>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-user-circle text-gray-400"></i> Profil Saya
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <i className="fas fa-cog text-gray-400"></i> Pengaturan
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <i className="fas fa-sign-out-alt"></i> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
