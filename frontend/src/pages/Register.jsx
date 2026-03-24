import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, CardBody, Spinner, Checkbox } from '@heroui/react';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaStar } from 'react-icons/fa6';
import api from '../config/api';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Min 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';

    if (!agreedToTerms) newErrors.terms = 'Agreement required';

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
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        const { token, user } = response.data;
        login(user, token);
        navigate('/dashboard');
      }
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Registration failed.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col font-sans selection:bg-blue-600/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center px-4 py-20">
        {/* Decorative Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px] animate-fade-in">
          <Card className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
            <CardBody className="p-10 space-y-8 overflow-hidden">
              
              {/* Branding Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xl">E</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Join Us</h1>
                <p className="text-slate-500 text-sm font-medium">Create your professional event profile</p>
              </div>

              {generalError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs font-bold text-center italic">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <FaUser size={12} className="text-blue-500" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    classNames={{
                      input: "text-white font-semibold placeholder-slate-500 text-base",
                      inputWrapper: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-500/70 h-14 rounded-xl transition-all duration-300 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/30",
                    }}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                  />
                </div>

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
                  <label className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <FaLock size={12} className="text-blue-500" />
                    Password
                  </label>
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

                <div className="space-y-2">
                  <label className="text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <FaLock size={12} className="text-blue-500" />
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    classNames={{
                      input: "text-white font-semibold placeholder-slate-500 text-base",
                      inputWrapper: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-blue-500/70 h-14 rounded-xl transition-all duration-300 shadow-lg focus-within:ring-2 focus-within:ring-blue-500/30",
                    }}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                  />
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="space-y-2 pt-1 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 transition-all">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={agreedToTerms}
                      onValueChange={setAgreedToTerms}
                      classNames={{
                        wrapper: "before:border-slate-600 after:bg-blue-600 rounded-md mt-1 transition-all",
                      }}
                    />
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                      I agree to the <a href="#" className="text-blue-400 hover:text-blue-300 underline transition-colors">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300 underline transition-colors">Privacy Policy</a>.
                    </p>
                  </div>
                  {errors.terms && <p className="text-red-400 text-[10px] font-black uppercase tracking-tighter pl-8">{errors.terms}</p>}
                </div>

                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 via-blue-500 to-blue-600 text-white font-black h-14 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Create Account</span>
                      <FaArrowRight size={16} />
                    </div>
                  )}
                </Button>
              </form>

              {/* Bottom Navigation */}
              <div className="space-y-6 pt-4 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-all duration-200 ml-1 border-b-2 border-blue-400/50 hover:border-blue-300">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}