import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaBars, FaXmark, FaRightFromBracket } from 'react-icons/fa6';
import { Button } from '@heroui/react';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">EventHub</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/events')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Events
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <p className="text-white font-semibold">{user?.name}</p>
                  <p className="text-gray-400 capitalize text-xs">{user?.role}</p>
                </div>

                <Button
                  isIconOnly
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleLogout}
                >
                  <FaRightFromBracket />
                </Button>

                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    navigate(user?.role === 'admin' ? '/admin' : '/dashboard')
                  }
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="light"
                  className="text-white"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && (
              <Button
                isIconOnly
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLogout}
              >
                <FaRightFromBracket />
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors px-2 py-2"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('/events');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors px-2 py-2"
            >
              Events
            </button>

            {!isAuthenticated && (
              <>
                <Button
                  fullWidth
                  variant="light"
                  className="text-white justify-start"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            {isAuthenticated && (
              <Button
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                Dashboard
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}