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
            <CardBody className="p-10 space-y-8">
              
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
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Atul Jamdar"
                  labelPlacement="outside"
                  value={formData.name}
                  onChange={handleChange}
                  classNames={{
                    label: "text-slate-400 font-bold text-xs uppercase tracking-widest",
                    input: "text-white font-semibold placeholder-slate-600",
                    inputWrapper: "bg-black/20 border-slate-800 hover:border-blue-500/50 h-14 rounded-xl border-2 transition-all shadow-inner",
                  }}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name}
                />

                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="name@company.com"
                  labelPlacement="outside"
                  value={formData.email}
                  onChange={handleChange}
                  classNames={{
                    label: "text-slate-400 font-bold text-xs uppercase tracking-widest",
                    input: "text-white font-semibold placeholder-slate-600",
                    inputWrapper: "bg-black/20 border-slate-800 hover:border-blue-500/50 h-14 rounded-xl border-2 transition-all shadow-inner",
                  }}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />

                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  labelPlacement="outside"
                  value={formData.password}
                  onChange={handleChange}
                  classNames={{
                    label: "text-slate-400 font-bold text-xs uppercase tracking-widest",
                    input: "text-white font-semibold placeholder-slate-600",
                    inputWrapper: "bg-black/20 border-slate-800 hover:border-blue-500/50 h-14 rounded-xl border-2 transition-all shadow-inner",
                  }}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  labelPlacement="outside"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  classNames={{
                    label: "text-slate-400 font-bold text-xs uppercase tracking-widest",
                    input: "text-white font-semibold placeholder-slate-600",
                    inputWrapper: "bg-black/20 border-slate-800 hover:border-blue-500/50 h-14 rounded-xl border-2 transition-all shadow-inner",
                  }}
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                />

                {/* Terms & Conditions Styled Checkbox */}
                <div className="space-y-2 pt-1 px-1">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      isSelected={agreedToTerms}
                      onValueChange={setAgreedToTerms}
                      classNames={{
                        wrapper: "before:border-slate-700 after:bg-blue-600 rounded-md",
                      }}
                    />
                    <p className="text-slate-500 text-xs font-bold leading-tight">
                      I agree to the <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                    </p>
                  </div>
                  {errors.terms && <p className="text-red-400 text-[10px] font-black uppercase tracking-tighter pl-8">{errors.terms}</p>}
                </div>

                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black h-14 rounded-xl text-lg shadow-xl hover:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span>Creating Account...</span>
                    </div>
                  ) : "Register"}
                </Button>
              </form>

              {/* Bottom Navigation */}
              <div className="space-y-6 pt-4 text-center">
                <p className="text-slate-500 text-sm font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white font-bold hover:text-blue-400 transition-colors ml-1 border-b border-white/20">
                    Sign in
                  </Link>
                </p>

                <div className="pt-6 border-t border-slate-800/50">
                  <div className="flex justify-center items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                    <FaStar size={10} className="text-blue-500/40" />
                    Secure registration process
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}