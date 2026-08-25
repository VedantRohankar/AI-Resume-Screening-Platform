import ai from "../config/gemini.js";
import { validateAIJobMatch } from "./aiValidatationServices.js";
import { callGeminiWithRetry } from "../utils/geminiError.js";

export const analyzeCandidateJobMatch = async (candidateProfile,job) => {
  const prompt = `
  You are an expert AI recruitment matching system.

Compare the candidate profile with the job description.

Return ONLY valid JSON using exactly this structure:

{
  "match_score": 0,
  "matched_skills": [],
  "missing_skills": [],
  "experience_match": "",
  "recommendation": "",
  "summary": ""
}

Rules:
- match_score must be a number between 0 and 100.
- matched_skills must be an array.
- missing_skills must be an array.
- experience_match must be a string.
- recommendation must be a string.
- summary must be a string.
- Do not invent candidate information.
- Base the comparison only on the provided candidate profile and job.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.

CANDIDATE PROFILE:
${JSON.stringify(candidateProfile)}

JOB:
${JSON.stringify(job)}
  `;

  const response = await callGeminiWithRetry(async () => {
     return await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });
  });

  const rawText = response.text.trim();

  const cleanedText = rawText
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

    const analysis = JSON.parse(cleanedText);
    validateAIJobMatch(analysis);

    return analysis;
};