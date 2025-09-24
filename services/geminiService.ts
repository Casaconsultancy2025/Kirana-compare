import { AnalysisResult, GroundingSource } from '../types';

// This function now calls our own secure backend proxy, not Google's API directly.
export const analyzeProduct = async (
  base64Image: string,
  mimeType: string,
  productName: string
): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  try {
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType, productName }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.text;
    
    // More robust JSON extraction
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);

    if (!jsonMatch) {
      console.error("Raw response from AI:", responseText);
      throw new Error("Could not find a valid JSON object in the AI's response.");
    }

    const jsonString = jsonMatch[1] || jsonMatch[2];
    
    let result: AnalysisResult;
    try {
      result = JSON.parse(jsonString);
    } catch(parseError) {
      console.error("Failed to parse JSON:", jsonString);
      throw new Error("The AI returned a malformed JSON response. Please try again.");
    }
    
    const groundingChunks = data.sources ?? [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
      .map((chunk: any) => ({
        uri: chunk.web.uri!,
        title: chunk.web.title!,
      }))
      .filter((source: GroundingSource, index: number, self: GroundingSource[]) => 
        index === self.findIndex((s) => s.uri === source.uri)
      );

    return { analysis: result, sources };

  } catch (error) {
      console.error("Error calling analysis proxy:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get analysis: ${error.message}`);
      }
      throw new Error("An unknown error occurred during analysis.");
  }
};
