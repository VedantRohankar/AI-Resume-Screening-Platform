import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  Brain, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Inbox,
  AlertCircle,
  LogIn
} from 'lucide-react';

const Register = () => {
  const { register, loginDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'candidate', // 'candidate' | 'recruiter'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // { message, isExistingUser }
  const [successInfo, setSuccessInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorInfo(null);
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInfo(null);
    setSuccessInfo(null);

    // Form validation
    if (formData.password.length < 6) {
      setErrorInfo({ message: 'Password must be at least 6 characters long.', isExistingUser: false });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const result = await register(payload);

      if (result.success) {
        setSuccessInfo({
          message: result.message || 'User registered successfully! Please check your email inbox to verify your account before logging in.',
          email: formData.email,
        });
        toast.success('Registration successful! Check your email to verify.');
      } else {
        const msg = result.message || 'Registration failed.';
        const isExisting = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already registered');
        setErrorInfo({
          message: msg,
          isExistingUser: isExisting,
        });
        toast.error(msg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Something went wrong during registration.';
      const isExisting = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already registered');
      setErrorInfo({
        message: msg,
        isExistingUser: isExisting,
      });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    loginDemo(role);
    toast.success(`Logged in as Demo ${role === 'recruiter' ? 'Recruiter' : 'Candidate'}!`);
    navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

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
          Create your account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Join the next generation of AI-driven talent intelligence
        </p>
      </div>

      {/* Register Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="glass-panel rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative z-10">
          
          {/* Quick Demo Shortcuts Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
              <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Want to test instantly without waiting for verification?</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition"
              >
                Demo Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('candidate')}
                className="flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/50 transition"
              >
                Demo Candidate
              </button>
            </div>
          </div>

          {/* Error Banner with Smart Existing User Action */}
          {errorInfo && (
            <div className={`mb-5 rounded-xl p-4 text-xs sm:text-sm border animate-in fade-in ${
              errorInfo.isExistingUser 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  errorInfo.isExistingUser ? 'text-amber-400' : 'text-rose-400'
                }`} />
                <div className="flex-1">
                  <div className="font-bold text-white mb-0.5">
                    {errorInfo.isExistingUser ? 'Account Already Exists (400)' : 'Registration Error (400)'}
                  </div>
                  <p className="leading-relaxed opacity-95">{errorInfo.message}</p>
                  
                  {errorInfo.isExistingUser && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-2.5">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition shadow-sm"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In with this Email</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleQuickDemo(formData.role)}
                        className="text-xs text-indigo-300 hover:text-white underline font-medium"
                      >
                        Or explore with Instant Demo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {successInfo && (
            <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Account Created Successfully!</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A verification link has been dispatched to <strong>{successInfo.email}</strong>. Please check your inbox (and spam folder) and click the link to activate your account.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md"
                >
                  Go to Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => handleQuickDemo(formData.role)}
                  className="text-xs text-indigo-300 underline font-semibold hover:text-white"
                >
                  Or enter instant demo mode now
                </button>
              </div>
            </div>
          )}

          {!successInfo && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Your Role *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Candidate Role Card */}
                  <div
                    onClick={() => handleRoleSelect('candidate')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === 'candidate'
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.role === 'candidate' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      {formData.role === 'candidate' && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">Job Candidate</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Upload your resume, see ATS AI insights, and match with open jobs.
                    </p>
                  </div>

                  {/* Recruiter Role Card */}
                  <div
                    onClick={() => handleRoleSelect('recruiter')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.role === 'recruiter'
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.role === 'recruiter' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      {formData.role === 'recruiter' && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">Hiring Recruiter</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Post jobs, screen applicant resumes automatically, and rank by AI match.
                    </p>
                  </div>

                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name / Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Work or Personal Email *
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
                    placeholder="alex.morgan@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password (min 6 characters)"
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
                <span>{loading ? 'Creating AI Account...' : `Register as ${formData.role === 'recruiter' ? 'Recruiter' : 'Candidate'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* Bottom Links */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Register;