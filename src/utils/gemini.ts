import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateContent = async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: req.body.prompt,
    });
    console.log(response.text);
    const text = response.text;

    for (let i = 0; i < text.length; i++) {
      res.write(`data: ${text[i]}\n\n`);
      await new Promise(r => setTimeout(r, 20));
    }

    res.write("data: [DONE]\n\n");
    res.end();
  }
  catch (err) {
    console.warn(err);
  }
}
