import ai from "../config/gemini.js";

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

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  const rawText = response.text.trim();

  // Remove markdown code fences if Gemini happens to add them
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Convert JSON string → JavaScript object
  const analysis = JSON.parse(cleanedText);

  return analysis;
};