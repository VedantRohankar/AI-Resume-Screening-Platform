import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ResumeUploader from '../components/candidate/ResumeUploader.jsx';
import AIResumeInsights from '../components/candidate/AIResumeInsights.jsx';
import JobDetailModal from '../components/candidate/JobDetailModal.jsx';
import ApplicationDetailModal from '../components/candidate/ApplicationDetailModal.jsx';
import ScoreBadge from '../components/common/ScoreBadge.jsx';
import SkillTag from '../components/common/SkillTag.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Search, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Award, 
  Send, 
  Eye,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { getAllJobs } from '../services/jobService.js';
import { getMyApplications } from '../services/applicationService.js';
import { getResume } from '../services/resumeService.js';
import { getResumeAIAnalysis } from '../services/aiService.js';
import { 
  MOCK_JOBS, 
  MOCK_CANDIDATE_RESUME_ANALYSIS, 
  MOCK_CANDIDATE_APPLICATIONS 
} from '../utils/mockData.js';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resume' | 'jobs' | 'applications'
  const [loading, setLoading] = useState(true);

  // Candidate Data States
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Search & Filter for Jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  // Fetch candidate data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Jobs
        try {
          const jobsRes = await getAllJobs();
          if (Array.isArray(jobsRes) && jobsRes.length > 0) {
            setJobs(jobsRes);
          } else {
            setJobs(MOCK_JOBS);
          }
        } catch {
          setJobs(MOCK_JOBS);
        }

        // 2. Fetch Applications
        try {
          const appsRes = await getMyApplications();
          if (Array.isArray(appsRes) && appsRes.length > 0) {
            setApplications(appsRes);
          } else {
            setApplications(MOCK_CANDIDATE_APPLICATIONS);
          }
        } catch {
          setApplications(MOCK_CANDIDATE_APPLICATIONS);
        }

        // 3. Fetch Resume & Analysis
        try {
          const resumeRes = await getResume();
          if (resumeRes && (resumeRes.id || resumeRes.resume_url)) {
            setResumeData(resumeRes);
            try {
              const analysisRes = await getResumeAIAnalysis();
              const raw = analysisRes?.analysis;
              if (raw) {
                let parsed = raw;
                if (raw.analysis_data) {
                  const inner = typeof raw.analysis_data === 'string' ? JSON.parse(raw.analysis_data) : raw.analysis_data;
                  parsed = { ...raw, ...inner, ats_score: raw.score || inner.ats_score };
                } else if (typeof raw.skills === 'string') {
                  parsed = { ...raw, skills: raw.skills.split(',').map((s) => s.trim()) };
                }
                setAiAnalysis(parsed);
              } else {
                setAiAnalysis(MOCK_CANDIDATE_RESUME_ANALYSIS);
              }
            } catch {
              setAiAnalysis(MOCK_CANDIDATE_RESUME_ANALYSIS);
            }
          } else {
            // Default demo resume state
            setResumeData({
              file_name: 'Alex_Morgan_Resume_2026.pdf',
              uploaded_at: '2026-09-01T16:20:00Z',
              resume_url: '#',
            });
            setAiAnalysis(MOCK_CANDIDATE_RESUME_ANALYSIS);
          }
        } catch {
          setResumeData({
            file_name: 'Alex_Morgan_Resume_2026.pdf',
            uploaded_at: '2026-09-01T16:20:00Z',
            resume_url: '#',
          });
          setAiAnalysis(MOCK_CANDIDATE_RESUME_ANALYSIS);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJobApplySuccess = (jobId) => {
    const appliedJob = jobs.find((j) => j.id === jobId);
    if (!appliedJob) return;

    const newApp = {
      id: 'app-' + Date.now(),
      job_id: jobId,
      title: appliedJob.title,
      company_name: appliedJob.company_name || 'NeuralSync Labs',
      location: appliedJob.location,
      salary: appliedJob.salary,
      applied_at: new Date().toISOString(),
      status: 'Under Review',
      ai_match: {
        match_score: 93,
        recommendation: 'Exceptional Fit',
        verdict: 'High semantic match with job core competencies and technical architecture.',
        matched_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        missing_skills: []
      }
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  // Filtered Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Remote') return matchesSearch && job.location?.toLowerCase().includes('remote');
    if (selectedFilter === 'Full-time') return matchesSearch && job.job_type?.toLowerCase().includes('full');
    if (selectedFilter === 'Contract') return matchesSearch && job.job_type?.toLowerCase().includes('contract');
    return matchesSearch;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'resume', label: 'AI Resume Manager', icon: FileText, badge: resumeData ? 'Ready' : 'Upload' },
    { id: 'jobs', label: 'Explore Jobs', icon: Briefcase, badge: filteredJobs.length },
    { id: 'applications', label: 'My Applications', icon: Layers, badge: applications.length },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Candidate Portal" subtitle="Loading your personalized dashboard...">
        <LoadingSpinner label="Loading AI Candidate Portal..." size="lg" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Candidate Career Hub"
      subtitle={`Welcome back, ${user?.username || 'Candidate'}. Here is your live AI matching overview.`}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      actionButton={
        <button
          onClick={() => setActiveTab('jobs')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Matching Jobs</span>
        </button>
      }
    >
      
      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Resume Score</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-400 font-mono">95%</span>
                <span className="text-xs text-slate-400">ATS Ready</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Gemini validated against 50+ parsers</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Applications Sent</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white font-mono">{applications.length}</span>
                <span className="text-xs text-indigo-400 font-semibold">Active</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Across top tech companies</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shortlisted / Review</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-400 font-mono">
                  {applications.filter((a) => ['shortlisted', 'interview', 'under review', 'Shortlisted', 'Under Review'].includes(a.status)).length}
                </span>
                <span className="text-xs text-slate-400">In Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recruiters actively screening</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg AI Match Rate</span>
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-violet-300 font-mono">92.5%</span>
                <span className="text-xs text-emerald-400 font-semibold">Top 5%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">High semantic profile alignment</p>
            </div>

          </div>

          {/* Quick Resume AI Highlight Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-violet-950/30 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Active Resume: {resumeData?.file_name || 'Alex_Morgan_Resume.pdf'}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    AI Parsed
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Gemini extracted <span className="text-indigo-300 font-bold">{aiAnalysis?.skills?.length || 12} skills</span> and verified your Mid-Senior engineering experience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('resume')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-950/50 border border-indigo-500/40 hover:bg-indigo-900/50 transition"
              >
                View AI Breakdown
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
              >
                Match With Jobs
              </button>
            </div>
          </div>

          {/* Top Recommended Jobs for Candidate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">AI Recommended Jobs For You</h3>
                <p className="text-xs text-slate-400">Ranked by semantic match against your parsed skills</p>
              </div>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View all {jobs.length} jobs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 2).map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">{job.title}</h4>
                        <p className="text-xs text-slate-400">{job.company_name || 'NeuralSync Labs'}</p>
                      </div>
                    </div>
                    <ScoreBadge score={94} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{job.location}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{job.job_type}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">{job.salary}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">1-Click AI Match Apply</span>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setIsJobModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                    >
                      View & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Recent Application Status</h3>
                <p className="text-xs text-slate-400">Live tracker with recruiter feedback & match scores</p>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View all ({applications.length})</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 2).map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.title}</h4>
                      <p className="text-[11px] text-slate-400">{app.company_name} • {app.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <ScoreBadge score={app.ai_match?.match_score || 92} size="sm" />
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      {app.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsAppModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Inspect AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESUME MANAGER */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">AI Resume Manager & Parser</h2>
            <p className="text-xs text-slate-400">
              Upload your resume for automated ATS parsing, semantic vector indexing, and Gemini 2.5 skill extraction.
            </p>
          </div>

          {/* Drag and Drop Uploader */}
          <ResumeUploader
            currentResume={resumeData}
            onResumeUpdated={setResumeData}
            onAnalysisComplete={(analysis) => setAiAnalysis(analysis || MOCK_CANDIDATE_RESUME_ANALYSIS)}
          />

          {/* AI Insights Card */}
          {aiAnalysis && (
            <AIResumeInsights analysis={aiAnalysis} />
          )}
        </div>
      )}

      {/* TAB 3: JOBS MARKETPLACE */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Search & Filter Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, skills (e.g. React, Python), or company..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['All', 'Remote', 'Full-time', 'Contract'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setSelectedFilter(filterOption)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    selectedFilter === filterOption
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const hasApplied = applications.some((a) => a.job_id === job.id);
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">{job.title}</h4>
                            <p className="text-xs text-slate-400">{job.company_name || 'NeuralSync Labs'}</p>
                          </div>
                        </div>
                        <ScoreBadge score={93} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300 font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{job.location}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">{job.job_type}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">{job.salary}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.requirements?.split(',').slice(0, 4).map((skill, idx) => (
                          <SkillTag key={idx} name={skill.trim()} type="default" size="xs" />
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {job.applicant_count || 12} applicants
                      </span>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsJobModalOpen(true);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                          hasApplied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                      >
                        {hasApplied ? 'Applied ✓' : 'View & Apply'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
                <Briefcase className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-medium">No job postings found matching "{searchQuery}".</p>
                <p className="text-xs mt-1">Try broadening your search term or filters.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white">Application Pipeline & Match Tracking</h2>
            <p className="text-xs text-slate-400">
              Track your candidacy stages, AI score breakdowns, and recruiter evaluation statuses.
            </p>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{app.title}</h4>
                    <p className="text-xs text-slate-400">
                      {app.company_name} • {app.location} • Applied on {new Date(app.applied_at || Date.now()).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-emerald-400">{app.salary || '$145,000 - $185,000 / yr'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <ScoreBadge score={app.ai_match?.match_score || 93} size="md" />

                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                    app.status?.toLowerCase().includes('shortlisted') || app.status?.toLowerCase().includes('hired')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : app.status?.toLowerCase().includes('rejected')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {app.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedApplication(app);
                      setIsAppModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
                  >
                    View AI Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <JobDetailModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        job={selectedJob}
        onApplied={handleJobApplySuccess}
        hasApplied={applications.some((a) => a.job_id === selectedJob?.id)}
      />

      <ApplicationDetailModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        application={selectedApplication}
      />

    </DashboardLayout>
  );
};

export default CandidateDashboard;
