import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert. Return ONLY a JSON object with a single key "test" and value "true". Output JSON.' },
        { role: 'user', content: 'Hello' }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });
    console.log("Success:", chatCompletion.choices[0]?.message?.content);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

test();
