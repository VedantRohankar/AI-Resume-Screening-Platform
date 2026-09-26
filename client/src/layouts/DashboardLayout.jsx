import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Brain,
  FileText,
  Briefcase,
  Users,
  BarChart3,
  Sparkles,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
  Bell
} from 'lucide-react';

const DashboardLayout = ({ children, title, subtitle, actionButton, activeTab, onTabChange, tabs = [] }) => {
  const { user, isRecruiter, isCandidate, logout, loginDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Signed out successfully.');
    navigate('/login');
  };

  const handleRoleSwitch = (newRole) => {
    loginDemo(newRole);
    toast.success(`Switched to Demo ${newRole === 'recruiter' ? 'Recruiter' : 'Candidate'} view!`);
    navigate(newRole === 'recruiter' ? '/recruiter' : '/candidate');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-extrabold text-white">Hire<span className="text-indigo-400">AI</span></span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:z-10 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Workspace */}
          <div className="p-5 border-b border-slate-800/80">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-white tracking-tight">Hire<span className="text-indigo-400">AI</span></span>
                <span className="block text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                  {isRecruiter ? 'Recruiter Hub' : 'Candidate Portal'}
                </span>
              </div>
            </Link>

            {/* Active User Card in Sidebar */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{user?.username}</p>
                  <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono capitalize ${
                    isRecruiter ? 'bg-indigo-500/10 text-indigo-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {user?.role || 'Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs in Sidebar */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange && onTabChange(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick AI Engine Status */}
          <div className="px-5 py-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Gemini AI Engine
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Resume parsing & matching models online (v2.5 Flash).
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Demo Role Switcher */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
            Test Alternate Persona
          </div>
          <button
            onClick={() => handleRoleSwitch(isRecruiter ? 'candidate' : 'recruiter')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/30 transition"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch to {isRecruiter ? 'Candidate' : 'Recruiter'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h1>
              {isRecruiter ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Recruiter Workspace
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Candidate Portal
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {actionButton}
          </div>
        </header>

        {/* Dashboard Body Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
