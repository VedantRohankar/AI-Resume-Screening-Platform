import ai from "../config/gemini.js";

export const testGemini = async (req,res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Say Hello From HireAI Resume Screening Platform",
    });

    res.status(200).json({
       message: response.text,
    });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: "Gemini API Error",
    error: error.message,
    details: error,
  });
}
}