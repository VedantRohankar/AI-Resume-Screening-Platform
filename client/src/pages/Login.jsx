import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  Brain, 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap, 
  Briefcase, 
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { forgotPassword } from '../services/authService.js';

const Login = () => {
  const { login, loginDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // { message, status }

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInfo(null);
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toast.success(`Welcome back, ${result.user?.username || 'User'}!`);
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else if (result.user?.role === 'recruiter') {
          navigate('/recruiter', { replace: true });
        } else {
          navigate('/candidate', { replace: true });
        }
      } else {
        setErrorInfo({
          message: result.message || 'Invalid email or password.',
          status: result.status,
        });
        toast.error(result.message || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorInfo({
        message: err.response?.data?.message || 'Login failed. Please check credentials.',
        status: err.response?.status,
      });
      toast.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    loginDemo(role);
    toast.success(`Welcome to HireAI Demo (${role.toUpperCase()})!`);
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    } else {
      navigate(role === 'recruiter' ? '/recruiter' : '/candidate', { replace: true });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email.');
      return;
    }
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success('Password reset link sent to your email!');
      setIsForgotModalOpen(false);
    } catch (err) {
      toast.info('If an account exists with this email, reset instructions have been sent.');
      setIsForgotModalOpen(false);
    } finally {
      setForgotLoading(false);
    }
  };

  const isVerificationError =
    errorInfo?.status === 403 ||
    errorInfo?.message?.toLowerCase().includes('verify');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center p-0.5 shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">Hire<span className="text-indigo-400">AI</span></span>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Sign in to your platform
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Access your AI candidate screening & matching portal
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative z-10">
          
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                1-Click Instant Demo:
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Bypass Auth
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-indigo-200 bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recruiter View</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('candidate')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-cyan-200 bg-cyan-600/30 border border-cyan-500/40 hover:bg-cyan-600/50 transition"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Candidate View</span>
              </button>
            </div>
          </div>

          {/* Targeted Error / Unverified Notice */}
          {errorInfo && (
            <div className={`mb-5 rounded-xl p-4 text-xs sm:text-sm border animate-in fade-in ${
              isVerificationError
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-start gap-2.5">
                {isVerificationError ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-white mb-0.5">
                    {isVerificationError ? 'Email Verification Required' : 'Authentication Error (400)'}
                  </div>
                  <p className="leading-relaxed opacity-90">{errorInfo.message}</p>
                  
                  {isVerificationError ? (
                    <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed">
                      💡 <strong>Note:</strong> Check your inbox for the verification link sent by the backend, or use the <strong>1-Click Instant Demo</strong> buttons above to test immediately!
                    </div>
                  ) : (
                    <div className="mt-2.5 pt-2.5 border-t border-rose-500/20 text-[11px] text-slate-400 leading-relaxed">
                      💡 If you haven't created an account yet, click <Link to="/register" className="text-indigo-400 underline font-semibold">Register</Link> or use the 1-Click Demo buttons above to explore all features.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Bottom Links */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Forgot Password Popup Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered email address to receive password reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
