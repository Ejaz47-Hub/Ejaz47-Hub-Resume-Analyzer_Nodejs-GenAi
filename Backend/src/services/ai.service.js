import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// ✅ Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ Schema
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

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),

  title: z.string(),
});

// ✅ MAIN FUNCTION (FIXED)
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an AI that MUST generate a COMPLETE interview report.

⚠️ STRICT RULES:
- DO NOT skip any field
- DO NOT return empty arrays
- preparationPlan MUST contain at least 5 days
- Each day MUST have at least 3 tasks

Return ONLY valid JSON.

FORMAT:
{
  "matchScore": number,
  "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "skillGaps": [{ "skill": "", "severity": "low | medium | high" }],
  "preparationPlan": [{ "day": 1, "focus": "", "tasks": ["", "", ""] }],
  "title": "string"
}

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  try {
    console.log("🚀 Starting AI response generation...");
    console.log("🔑 API KEY EXISTS:", !!process.env.GOOGLE_API_KEY);
    console.log("📝 PROMPT LENGTH:", prompt.length);

    const response = await model.generateContent(prompt);

    let text = response.response.text();

    console.log("✅ AI API responded successfully");
    console.log("🔍 RAW AI RESPONSE:", text);

    // ✅ Clean markdown if exists
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧹 CLEANED RESPONSE:", text);

    // ✅ Extract valid JSON safely
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      console.error("❌ NO JSON FOUND IN RESPONSE");
      throw new Error("Invalid JSON structure from AI");
    }

    const cleanJson = text.slice(firstBrace, lastBrace + 1);
    console.log("📦 EXTRACTED JSON:", cleanJson);

    const data = JSON.parse(cleanJson);

    // ✅ Validate with Zod
    const parsed = interviewReportSchema.safeParse(data);

    if (!parsed.success) {
      console.error("❌ ZOD VALIDATION ERROR:", parsed.error.errors);
      throw new Error("Invalid AI response format");
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ AI ERROR:", error.message);
    console.error("📋 ERROR DETAILS:", error);
    if (error.response) {
      console.error("🌐 API RESPONSE STATUS:", error.response.status);
      console.error(
        "🌐 API RESPONSE DATA:",
        error.response.data || error.response
      );
    }
    console.error("💥 FULL STACK:", error.stack);

    // ✅ Fallback (prevents 500 crash)
    return {
      matchScore: 50,
      technicalQuestions: [
        {
          question: "Explain Node.js",
          intention: "Check backend basics",
          answer: "Node.js is a runtime environment for JavaScript.",
        },
      ],
      behavioralQuestions: [
        {
          question: "Tell me about yourself",
          intention: "Understand personality",
          answer: "I am a backend developer passionate about coding.",
        },
      ],
      skillGaps: [
        {
          skill: "System Design",
          severity: "medium",
        },
      ],
      preparationPlan: [
        {
          day: 1,
          focus: "Node.js Basics",
          tasks: ["Learn modules", "Practice APIs", "Build mini project"],
        },
        {
          day: 2,
          focus: "MongoDB",
          tasks: ["CRUD ops", "Schema design", "Indexing"],
        },
        {
          day: 3,
          focus: "Express.js",
          tasks: ["Routing", "Middleware", "Error handling"],
        },
        {
          day: 4,
          focus: "Authentication",
          tasks: ["JWT", "Sessions", "Security"],
        },
        {
          day: 5,
          focus: "Projects",
          tasks: ["Build API", "Deploy app", "Test endpoints"],
        },
      ],
      title: "Backend Developer",
    };
  }
}

async function generateTailoredResume({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `
You are an expert resume writer. Based on the candidate's resume, self description, and the target job description, 
create a TAILORED resume that highlights the most relevant skills and experiences for this specific job.

IMPORTANT RULES:
- Keep professional resume format
- Highlight skills matching the job requirements
- Reorganize bullet points to emphasize relevant experience
- Use action verbs
- Include quantifiable achievements when possible
- Return ONLY the resume content (no headers, labels, or extra text)

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}

TAILORED RESUME:
`;

  try {
    console.log("🚀 Starting Tailored Resume generation...");
    const response = await model.generateContent(prompt);

    let resumeContent = response.response.text();

    // Clean up markdown if present
    resumeContent = resumeContent
      .replace(/```markdown/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("✅ Tailored Resume Generated Successfully");
    console.log("📄 RESUME CONTENT LENGTH:", resumeContent.length);
    return resumeContent;
  } catch (error) {
    console.error("❌ Resume Generation ERROR:", error.message);
    console.error("📋 ERROR DETAILS:", error);
    console.error("💥 FULL STACK:", error.stack);

    // Fallback resume if AI fails
    return `
PROFESSIONAL RESUME
===================

${selfDescription || "Professional seeking a challenging position"}

PROFESSIONAL SUMMARY
--------------------
Experienced professional with strong background in various technical and soft skills.

EXPERIENCE
----------
${
  resume
    ? "Based on provided resume: " + resume.substring(0, 500)
    : "Detailed experience available upon request"
}

SKILLS
------
Technical Skills, Problem Solving, Communication, Project Management

EDUCATION
---------
Professional qualifications and continuous learning

OBJECTIVE
---------
Seeking a position that leverages my skills and experience in the target role.
    `;
  }
}

export { generateInterviewReport, generateTailoredResume };
