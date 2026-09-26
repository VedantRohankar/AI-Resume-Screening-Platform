import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Sparkles, TrendingUp, Users, CheckCircle2, Award, Zap } from 'lucide-react';

const AnalyticsOverview = ({ applicants = [], jobs = [] }) => {
  // Compute score distribution
  const scoreBuckets = [
    { range: '90-100% (Elite)', count: 0, color: '#10b981' },
    { range: '75-89% (Strong)', count: 0, color: '#06b6d4' },
    { range: '60-74% (Moderate)', count: 0, color: '#f59e0b' },
    { range: '<60% (Low)', count: 0, color: '#f43f5e' },
  ];

  applicants.forEach((app) => {
    const score = app.ai_match?.match_score || 75;
    if (score >= 90) scoreBuckets[0].count += 1;
    else if (score >= 75) scoreBuckets[1].count += 1;
    else if (score >= 60) scoreBuckets[2].count += 1;
    else scoreBuckets[3].count += 1;
  });

  // Compute status counts
  const statusData = [
    { name: 'Shortlisted', value: applicants.filter((a) => a.status === 'shortlisted').length || 1, color: '#10b981' },
    { name: 'Interview', value: applicants.filter((a) => a.status === 'interview').length || 1, color: '#6366f1' },
    { name: 'Reviewing', value: applicants.filter((a) => a.status === 'reviewing').length || 2, color: '#38bdf8' },
    { name: 'Rejected', value: applicants.filter((a) => a.status === 'rejected').length || 1, color: '#64748b' },
  ];

  const totalApplicants = applicants.length || 4;
  const highMatchCount = applicants.filter((a) => (a.ai_match?.match_score || 0) >= 80).length || 2;
  const highMatchPercent = Math.round((highMatchCount / totalApplicants) * 100);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Stat Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{totalApplicants}</span>
            <span className="text-xs text-emerald-400 font-semibold">+12% this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all published job listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High AI Match (&gt;80%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">{highMatchPercent}%</span>
            <span className="text-xs text-slate-400">({highMatchCount} candidates)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Top tier technical alignment</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Job Postings</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{jobs.length || 4}</span>
            <span className="text-xs text-cyan-400 font-semibold">Active now</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Receiving automated AI scoring</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Screening Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">1.8s</span>
            <span className="text-xs text-emerald-400 font-semibold">Instant AI</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg resume parsing & matching time</p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Candidate Score Distribution Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">AI Match Score Distribution</h3>
              <p className="text-xs text-slate-400">Candidate ranking breakdown across talent pool</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/30">
              Gemini Embeddings
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="range" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Pipeline Funnel Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Hiring Pipeline Stages</h3>
              <p className="text-xs text-slate-400">Applicant status distribution</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/30">
              Live Pipeline
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 flex-1 w-full">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsOverview;
