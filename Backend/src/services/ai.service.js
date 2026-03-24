import { GoogleGenAI } from "@google/genai";
import {z} from "zod";
import {zodToJsonSchema} from 'zod-to-json-schema'
const ai = new GoogleGenAI({
    apiKey:process.env.Google_GENAI_API_KEY
})

async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:"Hello Bro ! Explain what is interview?"
    })
    console.log(response.text);
    
}
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score indicating how well the candidate's profile matches the job describe, on a scale of 0 to 100."),
    technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical questio can be asked in the interview"),
    intention:z.string().describe("The intention of interviewer behind asking this question"),
    answer:z.string().describe("How to answer this question, what points to cover,what approach to take etc.")
    })).describe("Technical question that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
    question: z.string().describe("The technical questio can be asked in the interview"),
    intention:z.string().describe("The intention of interviewer behind asking this question"),
    answer:z.string().describe("How to answer this question, what points to cover,what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity:z.enum(["low","medium","high"]).describe("The severity od this skill gap, i.e")
    })).describe("List of skill gaps in the candidate's profile alon with their severity"),
    
    preparationPlan:z.array(z.object({
        day:z.number().describe("the day number in the preparation plan, e.g. 1 for the first day, 2 for the second day, and so on."),
        focus: z.string().describe("The main focus of the preparation for that day, e.g. 'Data Structures and Algorithms', 'System Design', 'Behavioral Questions', etc."),
        tasks: z.array(z.string()).describe("List of tasks to be completed on that day.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively")
})


async function generateInterviewReport({resume,selfdescribe,jobdescribe}){

const prompt = `
Generate a STRICT JSON interview report.

ORDER OF FIELDS MUST BE EXACTLY:
1. matchScore
2. technicalQuestions
3. behavioralQuestions
4. skillGaps
5. preparationPlan

CRITICAL RULES:
- DO NOT return null values
- DO NOT leave any field empty
- Every field must contain meaningful text
- If unsure, generate a reasonable answer

STRUCTURE REQUIREMENTS:

technicalQuestions:
- Array of objects
- Each object must have:
  {
    "question": "real question",
    "intention": "clear reason",
    "answer": "detailed explanation"
  }

behavioralQuestions:
- Same structure as above

skillGaps:
- Each object:
  {
    "skill": "skill name",
    "severity": "low | medium | high"
  }

preparationPlan:
- Minimum 7 days
- Each day:
  {
    "day": 1,
    "focus": "topic",
    "tasks": ["task1", "task2"]
  }

matchScore:
- Must be a number between 0–100 (NOT null)

IMPORTANT:
- NEVER use null
- NEVER return empty strings
- ALWAYS fill all fields

Candidate Resume:
${resume || "Fresher with MERN stack experience"}

Self Description:
${selfdescribe || "Motivated developer"}

Job Description:
${jobdescribe || "Full Stack Developer role"}
`;


    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseJsonSchema:zodToJsonSchema(interviewReportSchema)
        }
    }) 

    return JSON.parse(response.text)
    
}

export {invokeGeminiAi,generateInterviewReport}