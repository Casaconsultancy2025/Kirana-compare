
// Fix: Removed non-existent 'InlineDataPart' from imports as it is not an exported member of '@google/genai'.
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    priceComparison: { 
      type: Type.STRING, 
      description: "A summary of the price range, e.g., '₹1500 - ₹1800' or 'Avg. ₹1650'." 
    },
    deliveryTimes: { 
      type: Type.STRING, 
      description: "A summary of typical delivery times, e.g., '1-3 business days'." 
    },
    qualityRatings: { 
      type: Type.STRING, 
      description: "An average quality rating from various platforms, e.g., '4.5/5 stars'." 
    },
    platformAvailability: { 
      type: Type.STRING, 
      description: "A comma-separated list of major platforms where the product is available, e.g., 'Amazon, Flipkart, Myntra'." 
    },
  },
  required: ["priceComparison", "deliveryTimes", "qualityRatings", "platformAvailability"],
};

export const analyzeProduct = async (
  base64Image: string,
  mimeType: string,
  productName: string
): Promise<AnalysisResult> => {
  try {
    // Fix: Removed the 'InlineDataPart' type annotation as it is not an exported member of '@google/genai'.
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const prompt = `Analyze the product in the image, which is a "${productName}". Search online stores and marketplaces to provide a detailed comparison. Return the price comparison, typical delivery times, average quality ratings, and platform availability. Ensure the response is a clean JSON object adhering to the provided schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as AnalysisResult;
  } catch (error) {
      console.error("Error analyzing product with Gemini API:", error);
      throw new Error("Failed to get analysis from the AI. The response might be malformed or the service is unavailable.");
  }
};