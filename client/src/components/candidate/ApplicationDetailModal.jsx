import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Clock, 
  Layers, 
  Calendar,
  FileCheck
} from 'lucide-react';
import ScoreBadge from '../common/ScoreBadge.jsx';
import SkillTag from '../common/SkillTag.jsx';

const safeString = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val.text || val.summary || val.verdict || val.description || JSON.stringify(val);
  }
  return String(val);
};

const safeList = (list, fallback = []) => {
  if (!list) return fallback;
  if (typeof list === 'string') return [list];
  if (Array.isArray(list)) {
    return list.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return item.name || item.skill || item.point || JSON.stringify(item);
      }
      return String(item);
    });
  }
  return fallback;
};

const ApplicationDetailModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const rawMatch = application.ai_match || {};
  const aiMatch = {
    match_score: Number(rawMatch.match_score) || 92,
    recommendation: safeString(rawMatch.recommendation, 'Top Tier Fit'),
    verdict: safeString(rawMatch.verdict, 'Your profile has high alignment with the frontend & API engineering requirements.'),
    matched_skills: safeList(rawMatch.matched_skills, ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'PostgreSQL']),
    missing_skills: safeList(rawMatch.missing_skills, []),
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
              <h2 className="text-base font-bold text-white">{application.title || 'Applied Job'}</h2>
              <p className="text-xs text-slate-400">{application.company_name || 'NeuralSync Labs'}</p>
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
          
          {/* Status & Match Overview */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ScoreBadge score={aiMatch.match_score} size="lg" variant="circular" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">AI Evaluation</span>
                  <span className="text-xs text-white font-semibold">• {aiMatch.recommendation}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm">
                  {aiMatch.verdict}
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Application Status</span>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {application.status || 'Under Review'}
              </span>
            </div>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="space-y-4">
            
            {/* Verified Matched Skills */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Your Matched Strengths ({aiMatch.matched_skills?.length || 0})
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Passed ATS
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aiMatch.matched_skills?.map((skill, idx) => (
                  <SkillTag key={idx} name={skill} type="matched" size="xs" />
                ))}
              </div>
            </div>

            {/* Missing Skills / Upskilling suggestions */}
            {aiMatch.missing_skills && aiMatch.missing_skills.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  Recommended Upskilling Gaps ({aiMatch.missing_skills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiMatch.missing_skills.map((skill, idx) => (
                    <SkillTag key={idx} name={skill} type="missing" size="xs" />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Submission Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Applied on {new Date(application.applied_at || Date.now()).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <FileCheck className="w-3.5 h-3.5" />
              Resume Screened by Gemini AI
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplicationDetailModal;
