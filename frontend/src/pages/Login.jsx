import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, CardBody, Spinner } from '@heroui/react';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa6';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

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

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setGeneralError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Card */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardBody className="gap-6 p-8">
              {/* General Error Message */}
              {generalError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    startContent={<FaEnvelope className="text-gray-400" />}
                    classNames={{
                      input: "bg-white/10 text-white placeholder-gray-400",
                      inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
                    }}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    startContent={<FaLock className="text-gray-400" />}
                    classNames={{
                      input: "bg-white/10 text-white placeholder-gray-400",
                      inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
                    }}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="rounded border-gray-400" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" color="current" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-gray-400">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Sign up here
                </Link>
              </p>

              {/* Demo Account Info */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <p className="text-blue-300 text-xs font-semibold mb-2">Demo Credentials:</p>
                <p className="text-blue-200 text-xs">User: john@example.com / password123</p>
                <p className="text-blue-200 text-xs">Admin: admin@example.com / adminpass123</p>
              </div>
            </CardBody>
          </Card>

          {/* Footer Text */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>By signing in, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}