export const MOCK_JOBS = [
  {
    id: "job-101",
    title: "Senior Full-Stack AI Engineer",
    company_name: "NeuralSync Labs",
    company_id: "comp-1",
    location: "San Francisco, CA (Hybrid)",
    job_type: "Full-time",
    experience_level: "Senior Level (4+ yrs)",
    salary: "$145,000 - $185,000 / yr",
    description: "We are building autonomous multi-modal agent workflows. You will lead frontend architecture with React & Tailwind, craft high-throughput Python/Node backends, and optimize LLM prompt chains & vector embeddings with Postgres pgvector.",
    requirements: "React, Node.js, TypeScript, PostgreSQL, Python, Vector Search, Tailwind CSS, Docker",
    created_at: "2026-08-28T10:00:00Z",
    applicant_count: 14,
    status: "active"
  },
  {
    id: "job-102",
    title: "Lead AI/ML Research Scientist",
    company_name: "Synthetix AI",
    company_id: "comp-2",
    location: "Remote (Global)",
    job_type: "Full-time",
    experience_level: "Principal (5+ yrs)",
    salary: "$170,000 - $220,000 / yr",
    description: "Design and fine-tune foundation models, multi-agent orchestrations, and LLM evaluation benchmarks for enterprise resume matching and cognitive automation.",
    requirements: "PyTorch, Transformers, LLM Fine-Tuning, Python, LangChain, RAG, Cloud Architecture",
    created_at: "2026-08-30T14:30:00Z",
    applicant_count: 8,
    status: "active"
  },
  {
    id: "job-103",
    title: "Frontend Platform Engineer",
    company_name: "Vertex Cloud",
    company_id: "comp-3",
    location: "New York, NY (Remote)",
    job_type: "Full-time",
    experience_level: "Mid-Senior (3+ yrs)",
    salary: "$120,000 - $155,000 / yr",
    description: "Build ultra-responsive web dashboards, micro-frontends, real-time streaming interfaces, and accessible design system components in React 19.",
    requirements: "React, TypeScript, Tailwind CSS, Vite, WebSockets, State Management, Jest, REST APIs",
    created_at: "2026-09-01T09:15:00Z",
    applicant_count: 22,
    status: "active"
  },
  {
    id: "job-104",
    title: "DevOps & Cloud Infrastructure Lead",
    company_name: "HyperScale Systems",
    company_id: "comp-4",
    location: "Austin, TX (Hybrid)",
    job_type: "Contract",
    experience_level: "Senior (4+ yrs)",
    salary: "$90 - $120 / hr",
    description: "Scale multi-region Kubernetes clusters, automated CI/CD deployment pipelines, Neon Postgres read-replicas, and Cloudflare edge computing.",
    requirements: "Kubernetes, Terraform, AWS, Docker, GitHub Actions, PostgreSQL, Prometheus, Grafana",
    created_at: "2026-08-25T11:45:00Z",
    applicant_count: 11,
    status: "active"
  }
];

export const MOCK_CANDIDATE_RESUME_ANALYSIS = {
  skills: [
    "React.js",
    "JavaScript (ES6+)",
    "TypeScript",
    "Node.js",
    "Express.js",
    "Tailwind CSS",
    "PostgreSQL",
    "RESTful APIs",
    "Docker",
    "Git & CI/CD",
    "AI Prompt Engineering",
    "Gemini API"
  ],
  summary: "Results-driven Full-Stack Software Engineer with 4+ years of hands-on experience architecting modern React single-page applications, resilient Node.js backends, and AI-assisted workflow engines. Proven record in reducing page load times by 42% and implementing real-time streaming features.",
  experience_level: "Mid-Senior Level (4.2 Years)",
  education: "B.S. in Computer Science & Engineering - State Technological University (2022)",
  strengths: [
    "Exceptional component-driven UI/UX design with React & Tailwind CSS",
    "Strong backend integration with Postgres, JWT security & Express",
    "Hands-on AI agent integration and LLM prompt optimization"
  ],
  recommendation: "Strong candidate for Senior Frontend, Full-Stack AI Engineer, and Cloud Product engineering roles.",
  resume_url: "https://example.com/resume-preview.pdf",
  file_name: "Alex_Morgan_Resume_2026.pdf",
  uploaded_at: "2026-09-01T16:20:00Z"
};

export const MOCK_APPLICANTS = [
  {
    id: "app-201",
    candidate_id: "cand-1",
    candidate_name: "Sarah Chen",
    candidate_email: "sarah.chen@example.com",
    applied_job_id: "job-101",
    applied_job_title: "Senior Full-Stack AI Engineer",
    applied_at: "2026-09-01T14:20:00Z",
    status: "shortlisted",
    resume_url: "https://example.com/sarah-chen-resume.pdf",
    ai_match: {
      match_score: 96,
      recommendation: "Exceptional Match",
      verdict: "Top-tier candidate. Exceeds core requirements in React, Node.js, and Vector search. Significant production experience with Postgres and AI APIs.",
      matched_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Python", "Tailwind CSS", "Vector Search"],
      missing_skills: ["Docker Swarm"],
      experience_match: "5.5 years of relevant engineering experience against 4+ years required.",
      strengths: ["Direct experience building LLM prompt workflows", "Strong modern React architecture expertise"],
      notes: "Candidate has previously published open-source React agent libraries."
    }
  },
  {
    id: "app-202",
    candidate_id: "cand-2",
    candidate_name: "Devon Reynolds",
    candidate_email: "devon.reynolds@example.com",
    applied_job_id: "job-101",
    applied_job_title: "Senior Full-Stack AI Engineer",
    applied_at: "2026-09-01T15:45:00Z",
    status: "interview",
    resume_url: "https://example.com/devon-reynolds-resume.pdf",
    ai_match: {
      match_score: 88,
      recommendation: "Strong Match",
      verdict: "Solid technical background with 4 years in React and Node.js. Demonstrates good understanding of PostgreSQL and cloud deployments.",
      matched_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Tailwind CSS"],
      missing_skills: ["Python", "Vector Search"],
      experience_match: "4.0 years experience matches the Senior requirement.",
      strengths: ["Clean code standards", "Comprehensive testing coverage knowledge"],
      notes: "Can ramp up on Python vector embeddings quickly."
    }
  },
  {
    id: "app-203",
    candidate_id: "cand-3",
    candidate_name: "Maya Patel",
    candidate_email: "maya.patel@example.com",
    applied_job_id: "job-101",
    applied_job_title: "Senior Full-Stack AI Engineer",
    applied_at: "2026-09-02T08:10:00Z",
    status: "reviewing",
    resume_url: "https://example.com/maya-patel-resume.pdf",
    ai_match: {
      match_score: 74,
      recommendation: "Moderate Match",
      verdict: "Strong frontend capabilities in React and Tailwind, but backend is primarily focused on Ruby rather than Node/Python.",
      matched_skills: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      missing_skills: ["Node.js", "Python", "Vector Search", "Docker"],
      experience_match: "3.2 years total software development experience.",
      strengths: ["Great UI design sensibilities", "High velocity on frontend features"],
      notes: "Would require pairing on Node.js / Python LLM backend services."
    }
  },
  {
    id: "app-204",
    candidate_id: "cand-4",
    candidate_name: "Liam O'Connor",
    candidate_email: "liam.oconnor@example.com",
    applied_job_id: "job-101",
    applied_job_title: "Senior Full-Stack AI Engineer",
    applied_at: "2026-08-31T18:00:00Z",
    status: "rejected",
    resume_url: "https://example.com/liam-oconnor-resume.pdf",
    ai_match: {
      match_score: 48,
      recommendation: "Low Match",
      verdict: "Profile is focused on legacy Java enterprise monoliths with minimal modern React or AI workflow exposure.",
      matched_skills: ["PostgreSQL", "Docker"],
      missing_skills: ["React", "Node.js", "TypeScript", "Python", "Tailwind CSS", "Vector Search"],
      experience_match: "Seniority met in traditional Java, but misaligned with modern web & AI stack.",
      strengths: ["Database schema design"],
      notes: "Recommend keeping in talent pool for enterprise backend roles."
    }
  }
];

export const MOCK_CANDIDATE_APPLICATIONS = [
  {
    id: "my-app-1",
    job_id: "job-101",
    title: "Senior Full-Stack AI Engineer",
    company_name: "NeuralSync Labs",
    location: "San Francisco, CA (Hybrid)",
    salary: "$145,000 - $185,000 / yr",
    applied_at: "2026-09-01T12:00:00Z",
    status: "Shortlisted",
    ai_match: {
      match_score: 94,
      recommendation: "Top Tier Candidate",
      verdict: "Your profile matches 94% of the role requirements. Your strengths in React, Tailwind, and Node.js are an exact match for NeuralSync's core team.",
      matched_skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "RESTful APIs"],
      missing_skills: ["Vector Search"]
    }
  },
  {
    id: "my-app-2",
    job_id: "job-103",
    title: "Frontend Platform Engineer",
    company_name: "Vertex Cloud",
    location: "New York, NY (Remote)",
    salary: "$120,000 - $155,000 / yr",
    applied_at: "2026-08-30T10:30:00Z",
    status: "Under Review",
    ai_match: {
      match_score: 91,
      recommendation: "Strong Match",
      verdict: "Exceptional alignment with frontend architecture and modern web standards. Recharts and Framer Motion experience adds extra value.",
      matched_skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "REST APIs"],
      missing_skills: ["WebSockets"]
    }
  }
];
