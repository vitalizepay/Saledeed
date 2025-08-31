
import { GoogleGenAI } from "@google/genai";
import { GEMINI_PROMPT } from '../constants';
import type { FilePart } from '../types';

const fileToGenerativePart = async (file: File): Promise<FilePart> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const generateSaleDeed = async (files: { [key: string]: File }): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash';

  const [
    sampleDeedPart,
    sellerAadhaarPart,
    buyerAadhaarPart,
    sellerDeedPart,
  ] = await Promise.all([
    fileToGenerativePart(files.sampleDeed),
    fileToGenerativePart(files.sellerAadhaar),
    fileToGenerativePart(files.buyerAadhaar),
    fileToGenerativePart(files.sellerDeed),
  ]);

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { text: GEMINI_PROMPT },
                sampleDeedPart,
                sellerAadhaarPart,
                buyerAadhaarPart,
                sellerDeedPart,
            ],
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate the sale deed from the Gemini API.");
  }
};
