DROP TABLE IF EXISTS resume_analysis CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20)
  CHECK(role IN('admin','recruiter','candidate'))
  DEFAULT 'candidate',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(15),
  address TEXT,
  bio TEXT,
  experience TEXT,
  education TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  profile_photo TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,

    recruiter_id INT UNIQUE NOT NULL,

    company_name VARCHAR(150) NOT NULL,

    industry VARCHAR(100),

    website TEXT,

    description TEXT,

    location VARCHAR(255),

    company_logo TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (recruiter_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,

    company_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    requirements TEXT,

    location VARCHAR(150),

    job_type VARCHAR(50),

    salary VARCHAR(100),

    experience_level VARCHAR(100),

    status VARCHAR(20) DEFAULT 'open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id)
    REFERENCES companies(id)
    ON DELETE CASCADE
);

CREATE TABLE resumes(
  id SERIAL PRIMARY KEY,
  candidate_id INT NOT NULL,
  resume_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(candidate_id)
  REFERENCES users(id)
  ON DELETE CASCADE
);

CREATE TABLE applications(
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL,
  candidate_id INT NOT NULL,
  status VARCHAR(30) DEFAULT 'Pending',
   applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   FOREIGN KEY (job_id)
   REFERENCES jobs(id)
   ON DELETE CASCADE,

   FOREIGN KEY (candidate_id)
   REFERENCES users(id)
   ON DELETE CASCADE
   UNIQUE(job_id, candidate_id)
);

CREATE TABLE resume_analysis(
  id SERIAL PRIMARY KEY,
  resume_id INT NOT NULL,
  score INT,
  summary TEXT,
  skills TEXT,
  missing_skills TEXT,
  suggestions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (resume_id)
  REFERENCES resumes(id)
  ON DELETE CASCADE
);

CREATE TABLE ai_resume_analysis (
    id SERIAL PRIMARY KEY,
    candidate_id INT UNIQUE NOT NULL,
    extracted_text TEXT,
    skills TEXT[],
    education TEXT,
    experience TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (candidate_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
