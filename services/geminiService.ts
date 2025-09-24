// Fix: Removed non-existent 'InlineDataPart' from imports as it is not an exported member of '@google/genai'.
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeProduct = async (
  base64Image: string,
  mimeType: string,
  productName: string
): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  try {
    // Fix: Removed the 'InlineDataPart' type annotation as it is not an exported member of '@google/genai'.
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const prompt = `
      You are an expert product analyst. Your task is to analyze the product in the image, identified as "${productName}".
      Perform a web search to gather real-time data from online stores and marketplaces.
      
      Based on your search, compile the following information. IMPORTANT: All prices MUST be converted to and displayed in Indian Rupees (INR) using the '₹' symbol.
      - Price Comparison: A concise summary of the price range in INR (e.g., "₹1500 - ₹1800" or "Avg. ₹1650").
      - Delivery Times: A typical delivery timeframe (e.g., "1-3 business days").
      - Quality Ratings: A representative average rating (e.g., "4.5/5 stars").
      - Platform Availability: A comma-separated list of major online stores where it's sold (e.g., "Amazon, Flipkart, BigBasket").
      
      Your final output MUST BE a single, valid JSON object and nothing else. Do not include any text before or after the JSON. Do not use markdown formatting. The JSON structure must be exactly as follows:
      {
        "priceComparison": "...",
        "deliveryTimes": "...",
        "qualityRatings": "...",
        "platformAvailability": "..."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    // More robust JSON extraction
    const responseText = response.text;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);

    if (!jsonMatch) {
      console.error("Raw response from AI:", responseText);
      throw new Error("Could not find a valid JSON object in the AI's response.");
    }

    // Use the first non-null capture group which contains the JSON string
    const jsonString = jsonMatch[1] || jsonMatch[2];
    
    let result: AnalysisResult;
    try {
      result = JSON.parse(jsonString);
    } catch(parseError) {
      console.error("Failed to parse JSON:", jsonString);
      throw new Error("The AI returned a malformed JSON response. Please try again.");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: GroundingSource[] = groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri && chunk.web.title)
      .map(chunk => ({
        uri: chunk.web.uri!,
        title: chunk.web.title!,
      }))
      // Remove duplicate URIs
      .filter((source, index, self) => 
        index === self.findIndex((s) => s.uri === source.uri)
      );

    return { analysis: result, sources };
  } catch (error) {
      console.error("Error analyzing product with Gemini API:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get analysis from the AI: ${error.message}`);
      }
      throw new Error("An unknown error occurred during AI analysis.");
  }
};