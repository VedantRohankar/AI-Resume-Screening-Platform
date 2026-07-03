# HireAI - AI Resume Screening Platform

## Overview

HireAI is an AI-powered Resume Screening Platform designed to simplify the hiring process for recruiters and improve job opportunities for candidates.

Instead of manually reviewing hundreds of resumes, recruiters can post job openings and allow candidates to apply through the platform. The uploaded resumes are analyzed using Artificial Intelligence (Gemini/OpenAI), which extracts skills, evaluates experience, compares resumes with job requirements, and generates an AI score for each candidate.

Candidates also receive personalized suggestions to improve their resumes, making the platform beneficial for both recruiters and job seekers.

This project demonstrates real-world backend development using Node.js, Express.js, PostgreSQL, JWT Authentication, Role-Based Access Control, AI Integration, File Uploads, Email Notifications, and RESTful APIs.

---

# Problem Statement

Recruiters often receive hundreds of resumes for a single job posting.

Manual screening is:

* Time-consuming
* Error-prone
* Inconsistent
* Difficult to scale

Many qualified candidates are overlooked because recruiters cannot review every resume carefully.

HireAI automates the initial screening process by using Artificial Intelligence to evaluate resumes, rank applicants, and assist recruiters in selecting the best candidates.

---

# Objectives

* Simplify recruitment workflow
* Reduce manual resume screening
* Provide AI-powered resume analysis
* Improve candidate resume quality
* Automate recruiter tasks
* Demonstrate enterprise-level backend architecture

---

# User Roles

## Candidate

Candidates can:

* Register and Login
* Complete Profile
* Upload Resume (PDF)
* View AI Resume Score
* View AI Suggestions
* Apply for Jobs
* Track Application Status
* Receive Email Notifications

---

## Recruiter

Recruiters can:

* Register/Login
* Create Job Openings
* Edit/Delete Jobs
* View Applicants
* Review AI Resume Analysis
* Shortlist Candidates
* Reject Applications
* Send Emails
* Track Hiring Progress

---

## Admin

Admins can:

* Manage Users
* Manage Recruiters
* View Platform Analytics
* Monitor AI Usage
* Manage Uploaded Resumes
* Remove Fake Accounts
* View System Logs

---

# Key Features

## Authentication

* JWT Authentication
* Password Hashing using bcrypt
* Secure Login
* Protected Routes
* Refresh Tokens (Optional)
* Forgot Password
* Email Verification

---

## Authorization

Role-Based Access Control (RBAC)

Roles:

* Admin
* Recruiter
* Candidate

Each role has access only to its authorized resources.

---

## Resume Upload

Candidates can upload resumes in PDF format.

Files are stored securely using cloud storage (Cloudinary/AWS S3).

---

## AI Resume Analysis

Artificial Intelligence analyzes uploaded resumes and provides:

* Resume Score
* Skill Extraction
* Experience Analysis
* Education Summary
* Missing Skills
* Resume Summary
* Resume Improvement Suggestions
* Job Match Percentage

---

## Job Management

Recruiters can:

* Create Jobs
* Update Jobs
* Delete Jobs
* View Applicants
* Manage Hiring Status

---

## Application Management

Candidates can:

* Apply to Jobs
* Track Status
* View Recruiter Response

Recruiters can:

* Accept Applications
* Reject Applications
* Shortlist Candidates

---

## Email Notifications

Automatic emails are sent for:

* Registration
* Email Verification
* Password Reset
* Resume Analysis Completed
* Application Submitted
* Candidate Shortlisted
* Candidate Rejected

---

## Dashboard

### Candidate Dashboard

* Resume Score
* Applications
* AI Suggestions
* Recent Activity

### Recruiter Dashboard

* Jobs Posted
* Applicants
* AI Rankings
* Hiring Progress

### Admin Dashboard

* Total Users
* Total Recruiters
* Active Jobs
* AI Requests
* Platform Statistics

---

# AI Features

* Resume Scoring
* Skill Detection
* Missing Skill Identification
* Resume Summary
* Resume Improvement Suggestions
* Job Match Percentage
* AI Interview Question Generation

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT
* bcrypt

## AI

* Google Gemini API / OpenAI API

## File Upload

* Multer
* Cloudinary / AWS S3

## Email

* Nodemailer

## Validation

* Express Validator / Zod

## Deployment

* Render / Railway

## Frontend

* React.js
* Tailwind CSS

---

# Database Design

Main Tables

* Users
* Profiles
* Recruiters
* Jobs
* Applications
* Resumes
* Resume Analysis
* Notifications
* Roles

Relationships

User
→ Profile

User
→ Resume

User
→ Applications

Recruiter
→ Jobs

Job
→ Applications

Resume
→ AI Analysis

---

# API Modules

Authentication

* Register
* Login
* Logout
* Forgot Password
* Reset Password

User

* Profile
* Update Profile

Resume

* Upload Resume
* Get Resume
* Delete Resume

Jobs

* Create Job
* Update Job
* Delete Job
* View Jobs

Applications

* Apply Job
* View Applications
* Update Status

AI

* Analyze Resume
* Generate Resume Score
* Suggest Improvements
* Match Resume with Job

Admin

* Manage Users
* Manage Recruiters
* Analytics

---

# Security Features

* JWT Authentication
* Password Hashing
* Protected Routes
* Role-Based Authorization
* Input Validation
* SQL Injection Prevention
* Environment Variables
* Rate Limiting
* Helmet Security
* CORS Protection

---

# Project Architecture

MVC Architecture

Routes

↓

Controllers

↓

Models

↓

Database

Additional Layers

* Middleware
* Services
* Utilities
* Configuration
* Validators

---

# Future Enhancements

* Video Interview Scheduling
* AI Chatbot
* Resume OCR
* Company Profiles
* Multi-Company Support
* Subscription Plans
* Interview Feedback AI
* AI Candidate Ranking
* Analytics Dashboard
* Mobile Application

---

# Learning Outcomes

This project demonstrates practical implementation of:

* REST API Development
* PostgreSQL Database Design
* Authentication & Authorization
* Role-Based Access Control
* File Upload Handling
* AI Integration
* Email Automation
* MVC Architecture
* Secure Backend Development
* Deployment
* Production-Level Project Structure

---

# Author

Developed by Vedant as a full-stack backend portfolio project to demonstrate enterprise-level software engineering skills and AI integration.
