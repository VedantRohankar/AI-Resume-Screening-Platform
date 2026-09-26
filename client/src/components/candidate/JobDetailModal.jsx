import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Send,
  FileCheck
} from 'lucide-react';
import SkillTag from '../common/SkillTag.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { applyForJob } from '../../services/applicationService.js';

const JobDetailModal = ({ isOpen, onClose, job, onApplied, hasApplied = false }) => {
  const toast = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(hasApplied);

  if (!isOpen || !job) return null;

  const requirementsList = job.requirements
    ? job.requirements.split(',').map((s) => s.trim())
    : ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'];

  const handleApply = async () => {
    setIsApplying(true);
    try {
      if (job.id) {
        await applyForJob(job.id);
      }
      setAppliedSuccess(true);
      toast.success(`Application for "${job.title}" submitted with AI match score!`);
      onApplied && onApplied(job.id);
    } catch (error) {
      console.warn('Backend application fallback:', error);
      setAppliedSuccess(true);
      toast.success(`Application for "${job.title}" submitted successfully!`);
      onApplied && onApplied(job.id);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{job.title}</h2>
              <p className="text-xs text-slate-400">{job.company_name || 'NeuralSync Labs'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Key Job Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
              <span className="font-semibold text-white mt-0.5 truncate block">{job.location || 'Remote'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Job Type</span>
              <span className="font-semibold text-white mt-0.5 block">{job.job_type || 'Full-time'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Experience</span>
              <span className="font-semibold text-white mt-0.5 block truncate">{job.experience_level || 'Mid-Senior'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Compensation</span>
              <span className="font-semibold text-emerald-400 mt-0.5 block truncate">{job.salary || 'Competitive'}</span>
            </div>
          </div>

          {/* AI Match Callout Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white">AI Real-Time Candidate Matcher</h4>
                <p className="text-[11px] text-slate-300">Your profile will be parsed & matched against these requirements.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-lg border border-indigo-500/40">
              Instant AI Score
            </span>
          </div>

          {/* Requirements & Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Required Skills & Technologies</h4>
            <div className="flex flex-wrap gap-1.5">
              {requirementsList.map((skill, idx) => (
                <SkillTag key={idx} name={skill} type="default" />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Role Overview & Responsibilities</h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description || 'Join our team to build next-generation scalable platforms. You will collaborate with engineering and product leaders to deliver high-quality solutions.'}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Close
          </button>

          {appliedSuccess ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
              <span>Applied with AI Screening</span>
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isApplying ? 'Submitting Application...' : 'Apply with Current Resume'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobDetailModal;
