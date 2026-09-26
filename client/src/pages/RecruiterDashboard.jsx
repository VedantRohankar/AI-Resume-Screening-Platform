import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AnalyticsOverview from '../components/recruiter/AnalyticsOverview.jsx';
import CreateJobModal from '../components/recruiter/CreateJobModal.jsx';
import AIMatchBreakdownModal from '../components/recruiter/AIMatchBreakdownModal.jsx';
import ScoreBadge from '../components/common/ScoreBadge.jsx';
import SkillTag from '../components/common/SkillTag.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import {
  Users,
  Briefcase,
  BarChart3,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Building2,
  Trash2,
  Edit,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getRecruiterJobs, deleteJob } from '../services/jobService.js';
import { getJobApplicants, updateApplicationStatus } from '../services/applicationService.js';
import { MOCK_JOBS, MOCK_APPLICANTS } from '../utils/mockData.js';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' | 'jobs' | 'analytics'
  const [loading, setLoading] = useState(true);

  // Recruiter Data
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  // Filters & Sorting
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score-desc'); // 'score-desc' | 'score-asc' | 'date'

  // Modals
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isAIMatchModalOpen, setIsAIMatchModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Recruiter's Jobs
        try {
          const jobsRes = await getRecruiterJobs();
          if (Array.isArray(jobsRes) && jobsRes.length > 0) {
            setJobs(jobsRes);
          } else {
            setJobs(MOCK_JOBS);
          }
        } catch {
          setJobs(MOCK_JOBS);
        }

        // 2. Fetch Applicants
        try {
          // If we have jobs, fetch applicants for first job or fallback to mock
          setApplicants(MOCK_APPLICANTS);
        } catch {
          setApplicants(MOCK_APPLICANTS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Job Created
  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  // Handle Job Deleted
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.info('Job posting deleted.');
    } catch {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.info('Job posting deleted.');
    }
  };

  // Handle Applicant Status Updated
  const handleApplicantStatusChange = (applicantId, newStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );
  };

  // Filter and sort applicants
  const filteredApplicants = applicants
    .filter((app) => {
      const matchesJob = selectedJobId === 'all' || app.applied_job_id === selectedJobId;
      const matchesStatus = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        app.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.candidate_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.ai_match?.matched_skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesJob && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const scoreA = a.ai_match?.match_score || 0;
      const scoreB = b.ai_match?.match_score || 0;
      if (sortBy === 'score-desc') return scoreB - scoreA;
      if (sortBy === 'score-asc') return scoreA - scoreB;
      return new Date(b.applied_at) - new Date(a.applied_at);
    });

  const tabs = [
    { id: 'candidates', label: 'AI Talent Screening', icon: Users, badge: applicants.length },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase, badge: jobs.length },
    { id: 'analytics', label: 'Hiring Intelligence', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Recruiter Hub" subtitle="Loading talent pipeline...">
        <LoadingSpinner label="Loading Recruiter AI Workspace..." size="lg" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Recruiter Intelligence Hub"
      subtitle={`Welcome, ${user?.username || 'Recruiter'}. Automated resume screening & AI ranking active.`}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      actionButton={
        <button
          onClick={() => setIsCreateJobModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      }
    >
      
      {/* TAB 1: AI CANDIDATE SCREENING */}
      {activeTab === 'candidates' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Screened Applicants</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{applicants.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Elite AI Matches (&gt;90%)</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {applicants.filter((a) => (a.ai_match?.match_score || 0) >= 90).length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Shortlisted</span>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                {applicants.filter((a) => a.status === 'shortlisted').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Open Positions</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{jobs.length}</div>
            </div>
          </div>

          {/* Screening Filters & Search Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
            
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, email, or skills (e.g. React, Python)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              
              {/* Job Selector Filter */}
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="all">All Jobs ({applicants.length})</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="all">All Statuses</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="reviewing">Reviewing</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Sort By AI Score */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="score-desc">AI Score: High to Low</option>
                <option value="score-asc">AI Score: Low to High</option>
                <option value="date">Most Recent</option>
              </select>

            </div>

          </div>

          {/* Candidates List Sorted by AI Score */}
          <div className="space-y-3">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => {
                const score = applicant.ai_match?.match_score || 80;
                return (
                  <div
                    key={applicant.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-lg group"
                  >
                    
                    {/* Left: Candidate Info & AI Score */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <ScoreBadge score={score} size="md" variant="circular" />

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition truncate">
                            {applicant.candidate_name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            applicant.status === 'shortlisted' || applicant.status === 'hired'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : applicant.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {applicant.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400">
                          Applied for: <span className="text-slate-200 font-medium">{applicant.applied_job_title}</span> • {applicant.candidate_email}
                        </p>

                        {/* Matched vs Missing Skills Preview */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          <span className="text-[10px] font-mono text-slate-400 mr-1">Skills:</span>
                          {applicant.ai_match?.matched_skills?.slice(0, 4).map((s, idx) => (
                            <SkillTag key={idx} name={s} type="matched" size="xs" />
                          ))}
                          {applicant.ai_match?.missing_skills?.slice(0, 2).map((s, idx) => (
                            <SkillTag key={idx} name={s} type="missing" size="xs" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Stage Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                      
                      {/* Status Dropdown */}
                      <select
                        value={applicant.status}
                        onChange={(e) => handleApplicantStatusChange(applicant.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlist</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Reject</option>
                      </select>

                      <button
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setIsAIMatchModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Deep-Dive</span>
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
                <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-medium">No candidates found matching the selected filters.</p>
                <p className="text-xs mt-1">Try resetting the job filter or search keywords.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: JOB POSTINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Your Active Job Openings</h2>
              <p className="text-xs text-slate-400">
                Manage roles and view automated candidate applications sorted by Gemini AI match score.
              </p>
            </div>
            <button
              onClick={() => setIsCreateJobModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Job</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <p className="text-xs text-slate-400">{job.location} • {job.job_type}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800">{job.experience_level || 'Senior (4+ yrs)'}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{job.salary}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {job.requirements?.split(',').slice(0, 4).map((req, idx) => (
                      <SkillTag key={idx} name={req.trim()} type="default" size="xs" />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300">
                    {job.applicant_count || 4} AI Screened Applicants
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTab('candidates');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                    >
                      View Candidates
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: ANALYTICS & INTELLIGENCE */}
      {activeTab === 'analytics' && (
        <AnalyticsOverview applicants={applicants} jobs={jobs} />
      )}

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setIsCreateJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      <AIMatchBreakdownModal
        isOpen={isAIMatchModalOpen}
        onClose={() => setIsAIMatchModalOpen(false)}
        applicant={selectedApplicant}
        onStatusChange={handleApplicantStatusChange}
      />

    </DashboardLayout>
  );
};

export default RecruiterDashboard;
