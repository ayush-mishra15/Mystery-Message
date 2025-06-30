import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export const runtime = 'edge';

export async function POST(_req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
      config: {
        temperature: 1.2,
        topK: 40,
        topP: 1,
        maxOutputTokens: 256,
      },
    });

    return NextResponse.json({ result: result.text ?? "No response from AI" });

  } catch (error: unknown) {
    // Type guard for Error object
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          name: error.name,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
