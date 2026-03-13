import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import {
  FaChartLine,
  FaCalendarDays,
  FaClipboardList,
  FaUsers,
  FaFileLines,
  FaBars,
  FaXmark,
  FaRightFromBracket,
  FaHouse,
} from 'react-icons/fa6';
import { useAuthStore } from '../store/authStore';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: FaHouse, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FaCalendarDays, label: 'Events', path: '/admin/events' },
    { icon: FaClipboardList, label: 'Bookings', path: '/admin/bookings' },
    { icon: FaChartLine, label: 'Analytics', path: '/admin/analytics' },
    { icon: FaFileLines, label: 'Reports', path: '/admin/reports' },
    { icon: FaUsers, label: 'Users', path: '/admin/users' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          isIconOnly
          className="bg-slate-800 border border-white/20 text-white hover:bg-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700/50 z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:block`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-white font-bold text-lg">EventHub</span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className={`px-6 py-4 border-b border-slate-700/50 ${!sidebarOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{user?.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-6 space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-3 right-3">
          <Button
            fullWidth
            className="bg-red-600 hover:bg-red-700 text-white"
            startContent={<FaRightFromBracket size={18} />}
            onClick={handleLogout}
          >
            {sidebarOpen && 'Logout'}
          </Button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-slate-800 border border-slate-700 rounded-full p-1 text-white hover:bg-slate-700 transition-colors hidden xl:block"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700/50 z-40">
            {/* Logo */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-white font-bold text-lg">EventHub</span>
              </div>
              <Button
                isIconOnly
                className="bg-transparent text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaXmark size={20} />
              </Button>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">Administrator</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="py-6 space-y-2 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-6 left-3 right-3">
              <Button
                fullWidth
                className="bg-red-600 hover:bg-red-700 text-white"
                startContent={<FaRightFromBracket size={18} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}