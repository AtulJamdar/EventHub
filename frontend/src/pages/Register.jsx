import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Card, CardBody, Spinner, Checkbox } from '@heroui/react';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa6';
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setGeneralError(errorMessage);
      console.error('Register error:', error);
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
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join us to manage your events</p>
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
                {/* Name Input */}
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    startContent={<FaUser className="text-gray-400" />}
                    classNames={{
                      input: "bg-white/10 text-white placeholder-gray-400",
                      inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
                    }}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                  />
                </div>

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
                    placeholder="Create a password"
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

                {/* Confirm Password Input */}
                <div>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    startContent={<FaLock className="text-gray-400" />}
                    classNames={{
                      input: "bg-white/10 text-white placeholder-gray-400",
                      inputWrapper: "bg-white/10 border border-white/20 hover:border-blue-400/50",
                    }}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    isSelected={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.terms;
                          return newErrors;
                        });
                      }
                    }}
                    classNames={{
                      wrapper: "after:bg-blue-500"
                    }}
                  />
                  <p className="text-gray-300 text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Terms & Conditions
                    </a>
                  </p>
                </div>
                {errors.terms && (
                  <p className="text-red-400 text-sm">{errors.terms}</p>
                )}

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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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

              {/* Login Link */}
              <p className="text-center text-gray-300 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </CardBody>
          </Card>

          {/* Footer Text */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Your data is safe and secure with us</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}