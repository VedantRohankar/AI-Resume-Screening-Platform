import ai from "../config/gemini.js";
import { validateResumeAnalysis } from "./aiValidatationServices.js";

// Helper to pause execution for Exponential Backoff
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert ATS resume analyzer.

Analyze the following resume and return ONLY valid JSON.

Use exactly this structure:

{
  "candidate_name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "ats_score": 0,
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "summary": "",
  "interview_questions": []
}

Rules:
- ats_score must be a number between 0 and 100.
- Extract information only from the resume.
- Do not invent information.
- If information is unavailable, use an empty string or empty array.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.

Resume:

${resumeText}
`;

  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds
  let response;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });
      break;
    } catch (error) {
      if (error.message.includes("503") || error.message.includes("UNAVAILABLE")) {
        if (attempt === maxRetries) {
          console.error("Max retries reached. Gemini is still unavailable.");
          throw error;
        }
        const waitTime = baseDelay * Math.pow(2, attempt);
        console.warn(`Gemini 503 Error. Retrying attempt ${attempt + 1} in ${waitTime}ms...`);
        await delay(waitTime);
      } else {
        throw error;
      }
    }
  }

  const rawText = response.text.trim();

  // Remove markdown code fences if Gemini happens to add them
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Convert JSON string → JavaScript object
  const analysis = JSON.parse(cleanedText);
  validateResumeAnalysis(analysis);

  return analysis;
};