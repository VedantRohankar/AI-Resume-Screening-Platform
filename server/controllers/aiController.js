// import ai from "../config/gemini.js";

// export const testGemini = async (req,res) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-flash-latest",
//       contents: "Say Hello From HireAI Resume Screening Platform",
//     });

//     res.status(200).json({
//        message: response.text,
//     });

//   } catch (error) {
//   console.error(error);

//   res.status(500).json({
//     message: "Gemini API Error",
//     error: error.message,
//     details: error,
//   });
// }
// }

//!Add a temporary test controller
  import {getResumeByCandidateId} from '../models/resumeModel.js';
  import {downloadResume} from '../services/downloadServices.js';
  import {extractTextFromPdf} from '../services/pdfServices.js';

  export const testResumeExtraction = async (req,res) => {
    try {
    const candidateId = req.user.id;
    
    //! 1.Get Resume From PostgreSql
    const resume = await getResumeByCandidateId(candidateId);

    if (!resume) {
      return res.status(404).json({
        message: 'Resume Not Found',
      });
    }

    //! 2.Download PDF from Clodinary
    const pdfBuffer = await downloadResume(resume.resume_url);

   

    //! 3. Extract text From PDF
    const resumeText = await extractTextFromPdf(pdfBuffer);

    // res.status(200).json({
    //   message: 'PDF converted into Text',
    // });
    //! 4. Return extracted text
     res.status(200).json({
      message: "Successfully Resume Extracted",
      text: resumeText,
    });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Resume Extraction Failed",
        error: error.message,
      });
      
    }
  }
