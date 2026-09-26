import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a11] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Hire<span className="text-indigo-400">AI</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation autonomous resume parsing, real-time Gemini AI candidate-job matching, and intelligent recruiter intelligence pipelines.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini AI, Postgres & React 19</span>
            </div>
          </div>

          {/* Candidate Portal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Candidates</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/candidate" className="hover:text-indigo-400 transition">Resume AI Analyzer</Link>
              </li>
              <li>
                <Link to="/candidate" className="hover:text-indigo-400 transition">Smart Job Marketplace</Link>
              </li>
              <li>
                <Link to="/candidate" className="hover:text-indigo-400 transition">Application Match Tracker</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">Create Candidate Account</Link>
              </li>
            </ul>
          </div>

          {/* Recruiter Portal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Recruiters</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/recruiter" className="hover:text-indigo-400 transition">Post Job Openings</Link>
              </li>
              <li>
                <Link to="/recruiter" className="hover:text-indigo-400 transition">AI Candidate Ranking</Link>
              </li>
              <li>
                <Link to="/recruiter" className="hover:text-indigo-400 transition">Skills Gap Analysis</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">Recruiter Registration</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HireAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Grade Security</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
