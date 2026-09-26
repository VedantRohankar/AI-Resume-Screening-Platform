import api from './api.js';

export const analyzeResumeAI = async () => {
  const response = await api.post('/ai/resume-analysis/analyze');
  return response.data;
};

export const getResumeAIAnalysis = async () => {
  const response = await api.get('/ai/resume-analysis');
  return response.data;
};

export const analyzeAIJobMatch = async (applicationId) => {
  const response = await api.post(`/ai/job-match/${applicationId}`);
  return response.data;
};
