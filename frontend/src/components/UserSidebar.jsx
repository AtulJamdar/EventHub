import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Tooltip, Divider } from '@heroui/react';
import {
  FaGaugeHigh,
  FaCalendarDays,
  FaClipboardList,
  FaBars,
  FaXmark,
  FaRightFromBracket,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa6';
import { useAuthStore } from '../store/authStore';

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: FaGaugeHigh, label: 'Dashboard', path: '/dashboard' },
    { icon: FaCalendarDays, label: 'Browse Events', path: '/events' },
    { icon: FaClipboardList, label: 'My Bookings', path: '/dashboard/my-bookings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* --- MOBILE TRIGGER --- */}
      <div className="fixed top-6 left-6 z-50 lg:hidden">
        <Button
          isIconOnly
          className="bg-[#111119] border border-white/10 text-white shadow-2xl rounded-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </Button>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
  className={`
    h-screen bg-[#111119] border-r border-white/10
    transition-all duration-500 ease-in-out
    ${sidebarOpen ? 'w-72' : 'w-24'}
    hidden lg:flex flex-col py-8
  `}
>
        {/* 1. Logo Section (High Vertical Spacing) */}
        <div className="px-7 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <span className="text-white font-black text-xl italic uppercase">E</span>
            </div>
            {sidebarOpen && (
              <span className="text-white font-black text-xl tracking-tighter uppercase animate-fade-in">
                Event<span className="text-blue-500">Hub</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. User Identity Section */}
        <div className={`px-6 mb-10 transition-all ${!sidebarOpen && 'flex justify-center'}`}>
          <div className={`flex items-center gap-4 p-3 rounded-2xl ${sidebarOpen ? 'bg-white/5 border border-white/5' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 font-bold text-white text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111119] rounded-full"></div>
            </div>
            {sidebarOpen && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-white font-bold text-xs truncate uppercase tracking-widest">{user?.name}</p>
                <p className="text-slate-500 text-[10px] font-bold">Standard Member</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Navigation (Interactive Hover) */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Tooltip 
                key={item.path} 
                content={item.label} 
                placement="right" 
                isDisabled={sidebarOpen}
                className="bg-slate-800 text-white text-xs font-bold"
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                    active
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/20 shadow-lg'
                      : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={20} className={`flex-shrink-0 group-hover:scale-110 transition-transform ${active ? 'scale-110' : ''}`} />
                  {sidebarOpen && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                </button>
              </Tooltip>
            );
          })}
        </nav>

        {/* 4. Bottom Area (Ghost Logout & Toggle) */}
        <div className="px-4 mt-auto space-y-6">
          <Divider className="bg-white/5" />
          
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                sidebarOpen 
                ? 'text-slate-500 hover:text-red-500 hover:bg-red-500/5' 
                : 'text-slate-500 hover:text-red-500 justify-center'
              }`}
            >
              <FaRightFromBracket size={18} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center py-2 text-slate-700 hover:text-white transition-colors"
            >
              {sidebarOpen ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR --- */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="fixed left-0 top-0 h-screen w-80 bg-[#111119] p-8 border-r border-white/10 flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-black uppercase italic">E</div>
                <span className="text-white font-black text-xl tracking-tighter uppercase">EventHub</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <FaXmark size={28} />
              </button>
            </div>

            <nav className="space-y-3 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-5 p-5 rounded-2xl text-lg font-bold border ${
                    isActive(item.path) ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'text-slate-500 border-transparent'
                  }`}
                >
                  <item.icon size={22} />
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              className="w-full flex items-center justify-center gap-3 h-16 bg-red-600/10 text-red-500 font-black rounded-2xl uppercase tracking-widest text-sm"
              onClick={handleLogout}
            >
              <FaRightFromBracket size={18} />
              Sign Out
            </button>
          </aside>
        </div>
      )}
    </>
  );
}