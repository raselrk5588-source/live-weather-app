import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; // Set timeout for Vercel/Next.js if needed

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert agricultural botanist and plant pathologist. 
      Analyze this image of a plant/leaf. 
      
      Respond STRICTLY in JSON format with the following keys:
      - "diseaseName": The name of the disease in Bengali (e.g., "ধানের ব্লাস্ট রোগ" or "সুস্থ গাছ" if it's healthy).
      - "accuracy": A string representing the confidence level in Bengali (e.g., "৯২% নিশ্চয়তা (AI)").
      - "description": A short 1-2 sentence description of what you see in Bengali.
      - "remedies": An array of strings containing 2-3 short actionable remedies or preventive measures in Bengali.

      Do not use any markdown formatting like \`\`\`json. Just return the raw JSON object.
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text().trim();
    
    // Attempt to parse JSON. We strip backticks if Gemini added them.
    const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const responseData = JSON.parse(cleanJsonStr);

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error scanning disease:", error);
    return NextResponse.json(
      { error: "Failed to analyze image. Ensure the image is clear and the API key is valid." },
      { status: 500 }
    );
  }
}
