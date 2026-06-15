import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; // Set timeout for Vercel/Next.js if needed

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return simulated mock response if API key is not configured
      return NextResponse.json({
        diseaseName: "ধানের ব্লাস্ট বা পাতাপোড়া রোগ (Demo Result)",
        accuracy: "৮৫% নিশ্চয়তা (API Key Missing)",
        description: "এটি একটি ডেমো রেজাল্ট। আসল AI বিশ্লেষণ পেতে .env.local ফাইলে আপনার GEMINI_API_KEY যুক্ত করুন।",
        remedies: [
          "আক্রান্ত পাতা বা ডাল দ্রুত কেটে ফেলে দিন।",
          "প্রতি লিটার পানিতে ২ গ্রাম পরিমাপে ম্যানকোজেব (Mancozeb) মিশিয়ে স্প্রে করুন।",
          "আসল ফলাফল পেতে আপনার Gemini API Key কনফিগার করুন।"
        ]
      });
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
