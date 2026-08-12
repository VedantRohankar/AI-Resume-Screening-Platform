import {PDFParse} from 'pdf-parse';

export const extractTextFromPdf = async (buffer) => {
  const parse = new PDFParse({
    data: buffer,
  });
  try {
    const result = await parse.getText();
    return result.text;
  } finally{
    await parse.destroy();
  }

};