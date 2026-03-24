import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, CardBody, Spinner } from '@heroui/react';
import { FaEnvelope, FaLock, FaArrowRight, FaStar } from 'react-icons/fa6';
import api from '../config/api';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        const { token, user } = response.data;
        login(user, token);
        user.role === 'admin' ? navigate('/admin/dashboard') : navigate('/dashboard');
      }
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col font-sans selection:bg-blue-600/30">
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center px-4 py-20">
        {/* Background Decorative Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
          {/* Card Wrapper */}
          <Card className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
            <CardBody className="p-10 space-y-8 overflow-hidden">
              
              {/* Branding & Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xl">E</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Sign In</h1>
                <p className="text-slate-500 text-sm font-medium">Continue to your EventHub account</p>
              </div>

              {generalError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs font-bold text-center italic">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <FaEnvelope size={12} className="text-blue-500" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    classNames={{
                      input: "text-white font-semibold placeholder-slate-500 text-base",
                      inputWrapper: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-500/70 h-14 rounded-xl transition-all duration-300 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/30",
                    }}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <FaLock size={12} className="text-blue-500" />
                      Password
                    </label>
                    <a href="#" className="text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-tighter transition-colors">Forgot?</a>
                  </div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    classNames={{
                      input: "text-white font-semibold placeholder-slate-500 text-base",
                      inputWrapper: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-500/70 h-14 rounded-xl transition-all duration-300 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/30",
                    }}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all" id="remember" />
                  <label htmlFor="remember" className="text-slate-400 text-xs font-bold cursor-pointer hover:text-slate-200 transition-colors">Remember this device</label>
                </div>

                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-black h-14 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <FaArrowRight size={16} />
                    </div>
                  )}
                </Button>
              </form>

              {/* Bottom Navigation */}
              <div className="space-y-6 pt-4 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-all duration-200 ml-1 border-b-2 border-blue-400/50 hover:border-blue-300">
                    Sign up here
                  </Link>
                </p>
              </div>

            </CardBody>
          </Card>

          {/* Minimal Footer Info */}
          <div className="mt-8 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] opacity-50">
            Secure Cloud Authentication • EventHub v2.0
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}