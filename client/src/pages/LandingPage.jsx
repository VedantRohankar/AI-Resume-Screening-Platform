import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import ScoreBadge from '../components/common/ScoreBadge.jsx';
import SkillTag from '../components/common/SkillTag.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  FileText, 
  Users, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Layers,
  BarChart3,
  Award,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const { loginDemo, isAuthenticated, isRecruiter } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Interactive Live Demo state on the landing page
  const [demoRole, setDemoRole] = useState('fullstack');
  const [demoScore, setDemoScore] = useState(94);
  const [isSimulating, setIsSimulating] = useState(false);

  const sampleRoles = {
    fullstack: {
      title: 'Senior Full-Stack AI Engineer',
      score: 94,
      matched: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Python'],
      missing: ['Vector DB'],
      verdict: 'Elite alignment. 4.5+ yrs experience with full stack & modern AI workflows exceeds requirements.'
    },
    ml: {
      title: 'Lead ML / NLP Research Scientist',
      score: 88,
      matched: ['Python', 'PyTorch', 'Transformers', 'LLM Prompting', 'FastAPI'],
      missing: ['Distributed Training', 'CUDA'],
      verdict: 'Strong match. Solid grounding in LLM architectures and model evaluation benchmarks.'
    },
    frontend: {
      title: 'Senior Frontend Platform Engineer',
      score: 97,
      matched: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'State Management', 'WebSockets'],
      missing: [],
      verdict: 'Perfect technical match. Deep expertise in high-performance single-page architectures.'
    }
  };

  const handleRoleChange = (key) => {
    setIsSimulating(true);
    setDemoRole(key);
    setTimeout(() => {
      setDemoScore(sampleRoles[key].score);
      setIsSimulating(false);
    }, 400);
  };

  const handleLaunchDemo = (role) => {
    loginDemo(role);
    toast.success(`Launched HireAI in ${role === 'recruiter' ? 'Recruiter' : 'Candidate'} mode!`);
    navigate(role === 'recruiter' ? '/recruiter' : '/candidate');
  };

  const currentSample = sampleRoles[demoRole];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Glowing Background Radial Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 backdrop-blur-md animate-ai-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">Powered by Gemini 2.5 Flash & Semantic Vector Matching</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Screen Resumes with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Precision AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual resume parsing. <strong className="text-white">HireAI</strong> automatically analyzes candidate experience, extracts verified skills, and delivers instant, objective match scores in seconds.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/30 transform hover:-translate-y-0.5 transition"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleLaunchDemo('recruiter')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-indigo-300 bg-indigo-950/40 border border-indigo-500/40 hover:bg-indigo-900/40 hover:border-indigo-400 transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Explore Recruiter Hub</span>
            </button>

            <button
              onClick={() => handleLaunchDemo('candidate')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/40 hover:border-cyan-400 transition"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Explore Candidate Hub</span>
            </button>
          </div>

          {/* Feature Highlights Trust Row */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Automated Parsing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              99.2% ATS Accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant Role Matching
            </span>
          </div>

        </div>

        {/* Live Interactive AI Matcher Preview Widget */}
        <div className="max-w-4xl mx-auto mt-16 relative z-10">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 glow-box-indigo">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Interactive AI Resume Screener</h3>
                  <p className="text-xs text-slate-400">Select a target job profile to watch Gemini AI calculate fit in real-time</p>
                </div>
              </div>

              {/* Sample Target Role Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                <button
                  onClick={() => handleRoleChange('fullstack')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    demoRole === 'fullstack' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full-Stack AI
                </button>
                <button
                  onClick={() => handleRoleChange('frontend')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    demoRole === 'frontend' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Frontend Lead
                </button>
                <button
                  onClick={() => handleRoleChange('ml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    demoRole === 'ml' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ML Research
                </button>
              </div>
            </div>

            {/* Simulated AI Result Viewport */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* AI Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-[11px] font-mono uppercase text-slate-400 mb-2">Calculated AI Fit</span>
                {isSimulating ? (
                  <div className="py-6 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-indigo-400 mt-2 font-mono">Parsing Vectors...</span>
                  </div>
                ) : (
                  <>
                    <ScoreBadge score={demoScore} size="lg" variant="circular" />
                    <p className="text-[11px] text-slate-400 mt-2">ATS Semantic Score</p>
                  </>
                )}
              </div>

              {/* Matched & Missing Skills Breakdown */}
              <div className="md:col-span-2 space-y-3">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-200">Target Role: {currentSample.title}</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                    "{currentSample.verdict}"
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Skills Matched ({currentSample.matched.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSample.matched.map((s, i) => (
                      <SkillTag key={i} name={s} type="matched" size="xs" />
                    ))}
                  </div>
                </div>

                {currentSample.missing.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Skill Gaps for Upskilling ({currentSample.missing.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentSample.missing.map((s, i) => (
                        <SkillTag key={i} name={s} type="missing" size="xs" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/70 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Enterprise AI Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Architected for modern talent teams
            </h2>
            <p className="text-sm text-slate-400">
              Transform high-volume applicant pipelines into prioritized, qualified shortlists with zero bias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Gemini 2.5 Semantic Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understands context beyond keywords. Discovers deep domain analogies, project complexity, and seniority indicators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Instant AI Candidate Ranking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sort hundreds of applications automatically by match score. Instantly isolate the top 5% of matching engineers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Candidate ATS Optimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Candidates receive instant feedback on resume strengths, missing skill gaps, and ATS readability to improve applications.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 p-10 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60 border border-indigo-500/40 shadow-2xl relative">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to experience next-gen hiring?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of recruiters and candidates leveraging AI to make faster, smarter, and fairer hiring decisions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition"
            >
              Sign In to Platform
            </Link>
          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
};

export default LandingPage;
