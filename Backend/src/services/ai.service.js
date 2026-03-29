import dotenv from "dotenv";
dotenv.config(); // ✅ IMPORTANT FIX

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";



const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// ✅ Test function
async function invokeGeminiAi() {
  const models = await ai.models.list();
  console.log(models);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Hello Bro! Explain what is interview?",
  });

  console.log(response.text);
}

// ✅ Schema (unchanged)
const interviewReportSchema = z.object({
  matchScore: z.number(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preprationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),

  title:z.string().describe("The title for the job for which the interview report is generated")
});

// ✅ Main function
async function generateInterviewReport({ resume, selfdescription, jobdescription }) {
const prompt = `
You are an AI that MUST generate a COMPLETE interview report.

⚠️ STRICT RULES:
- DO NOT skip any field
- DO NOT return empty arrays
- preparationPlan MUST contain at least 5 days
- Each day MUST have:
  - day (number)
  - focus (string)
  - tasks (at least 3 tasks)

Return ONLY valid JSON. Do not include any explanation or text.

FORMAT:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low | medium | high"
    }
  ],
  "preprationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["task1", "task2", "task3"]
    }
  ]
}

Candidate Resume:
${resume}

Self Description:
${selfdescription}

Job Description:
${jobdescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    generationConfig: {
    temperature: 0.3, // 🔥 more structured output
  }
  });

   let text = response.text;

  // ✅ Clean JSON if wrapped
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
   console.log("Raw AI Response:", text);  // Add this line
  const data = JSON.parse(text)


    const parsed = interviewReportSchema.safeParse(data);

    if (!parsed.success) {
      throw new Error("Invalid AI response format");
    }

    return parsed.data;

  } catch (err) {
    console.error("AI RAW RESPONSE:", text);
    throw new Error("Failed to parse AI response");
  }
}

export { invokeGeminiAi, generateInterviewReport };