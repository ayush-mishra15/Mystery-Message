import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],   // Note: contents should be an array of objects
      config: {
        temperature: 1.2,
        topK: 40,
        topP: 1,
        maxOutputTokens: 256,
      },
    });

    // result.text ya result?.text ho sakta hai, check karo console.log se
    return NextResponse.json({ result: result.text ?? "No response from AI" });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    // error.message aur error.name ko safely access karo
    return NextResponse.json({
      error: error.message ?? "Internal Server Error",
      name: error.name ?? "Error",
    }, { status: 500 });
  }
}
