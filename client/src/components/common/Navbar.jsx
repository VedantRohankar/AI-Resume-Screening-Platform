import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { 
  Sparkles, 
  Brain, 
  Briefcase, 
  FileText, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  UserCircle,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, isCandidate, logout, loginDemo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/login');
  };

  const handleQuickDemo = (role) => {
    const demoUser = loginDemo(role);
    setIsDemoDropdownOpen(false);
    toast.success(`Switched to Demo ${role === 'recruiter' ? 'Recruiter' : 'Candidate'} account!`);
    navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-extrabold tracking-tight text-white">Hire<span className="text-indigo-400">AI</span></span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Overview
            </Link>

            {isAuthenticated && (
              <>
                {isCandidate && (
                  <Link
                    to="/candidate"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/candidate') ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Candidate Portal
                  </Link>
                )}

                {isRecruiter && (
                  <Link
                    to="/recruiter"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/recruiter') ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Recruiter Hub
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400 transition"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Demo</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Select Test Role
                  </div>
                  <button
                    onClick={() => handleQuickDemo('recruiter')}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-indigo-500/10 transition group"
                  >
                    <Briefcase className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300">Recruiter Mode</div>
                      <div className="text-[11px] text-slate-400 leading-tight">Post jobs, screen applicants & AI rank</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickDemo('candidate')}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-indigo-500/10 transition group mt-1"
                  >
                    <FileText className="w-4 h-4 text-cyan-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300">Candidate Mode</div>
                      <div className="text-[11px] text-slate-400 leading-tight">Upload resume & track AI job match</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">
                      {user?.username}
                    </div>
                    <div className="text-[10px] font-mono text-indigo-400 capitalize">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-slate-200">{user?.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate(isRecruiter ? '/recruiter' : '/candidate');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b1120] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Overview
          </Link>

          {isAuthenticated ? (
            <>
              {isCandidate && (
                <Link
                  to="/candidate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 bg-indigo-500/10"
                >
                  Candidate Portal
                </Link>
              )}
              {isRecruiter && (
                <Link
                  to="/recruiter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 bg-indigo-500/10"
                >
                  Recruiter Hub
                </Link>
              )}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 font-medium"
                >
                  Sign Out ({user?.username})
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-lg border border-slate-700 text-sm font-medium text-white bg-slate-800/80"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Quick Demo Switcher for Mobile */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-slate-400 mb-2">QUICK DEMO PREVIEWS:</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleQuickDemo('recruiter');
                }}
                className="flex-1 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-center"
              >
                Recruiter Demo
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleQuickDemo('candidate');
                }}
                className="flex-1 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-center"
              >
                Candidate Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
