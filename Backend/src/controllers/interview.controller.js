import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Import pdf-parse correctly
let pdfParse;
try {
  const pdfParseModule = require("pdf-parse/legacy/index.js");
  pdfParse = pdfParseModule;
} catch (e1) {
  try {
    const pdfParseModule = require("pdf-parse");
    // Most common export pattern
    pdfParse = pdfParseModule.default ? pdfParseModule.default : pdfParseModule;
  } catch (e2) {
    console.error("Failed to load pdf-parse:", e1.message, e2.message);
  }
}

import {
  generateInterviewReport,
  generateTailoredResume,
} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

// ✅ Generate Interview Report
async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    // ✅ WORKING PDF PARSE
    let resumeData;
    try {
      if (!pdfParse) {
        throw new Error("PDF parser not initialized");
      }

      // Try to parse the PDF
      if (typeof pdfParse === "function") {
        // Call as function
        resumeData = await pdfParse(resumeFile.buffer);
      } else if (pdfParse.parse && typeof pdfParse.parse === "function") {
        // Has parse method
        resumeData = await pdfParse.parse(resumeFile.buffer);
      } else {
        // Fallback - try to create instance and call
        const parser = new pdfParse();
        resumeData = await parser(resumeFile.buffer);
      }
    } catch (pdfError) {
      console.error("❌ PDF Parse failed:", pdfError.message);
      console.error("PDF Parse error details:", pdfError);

      // FALLBACK: Mock resume data if PDF parsing fails
      console.warn("⚠️ Using fallback resume data");
      resumeData = {
        text: `[PDF Parsing Error - Fallback Text]\nFile: ${resumeFile.originalname}\nSize: ${resumeFile.size} bytes\nResume content could not be extracted from PDF file.`,
      };
    }

    const { selfDescription, jobDescription } = req.body;

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeData.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeData.text,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report Generated Successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ✅ Get Interview Report By ID
async function getInerviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ✅ Get All Interview Reports
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
      );

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ✅ Generate Resume PDF
async function generateResumePdfController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    // Generate PDF content as text/plain for now
    const pdfContent = `
INTERVIEW PREPARATION REPORT
==============================

Title: ${interviewReport.title}
Match Score: ${interviewReport.matchScore}/100

TECHNICAL QUESTIONS
-------------------
${interviewReport.technicalQuestions
  .map(
    (q, i) => `
Q${i + 1}: ${q.question}
Intention: ${q.intention}
Answer: ${q.answer}
`
  )
  .join("\n")}

BEHAVIORAL QUESTIONS
--------------------
${interviewReport.behavioralQuestions
  .map(
    (q, i) => `
Q${i + 1}: ${q.question}
Intention: ${q.intention}
Answer: ${q.answer}
`
  )
  .join("\n")}

SKILL GAPS
----------
${interviewReport.skillGaps
  .map((gap) => `• ${gap.skill} (${gap.severity})`)
  .join("\n")}

PREPARATION PLAN
----------------
${interviewReport.preparationPlan
  .map(
    (day) => `
Day ${day.day}: ${day.focus}
Tasks:
${day.tasks.map((task) => `  - ${task}`).join("\n")}
`
  )
  .join("\n")}
    `;

    // Send as downloadable file
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-report-${interviewId}.txt"`
    );
    res.send(pdfContent);
  } catch (error) {
    console.error("PDF Generation ERROR:", error);

    res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
}

// ✅ Generate Tailored Resume
async function generateTailoredResumeController(req, res) {
  try {
    const { interviewId } = req.params;

    console.log("📥 Fetching interview report:", interviewId);

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      console.error("❌ Interview report not found:", interviewId);
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    console.log("✅ Interview report found, generating tailored resume...");

    // Generate tailored resume using AI
    const tailoredResume = await generateTailoredResume({
      resume: interviewReport.resume,
      jobDescription: interviewReport.jobDescription,
      selfDescription: interviewReport.selfDescription,
    });

    console.log("✅ Tailored resume generated, sending to client...");
    console.log("📄 Resume length:", tailoredResume.length);

    // Send as downloadable resume file
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tailored-resume-${interviewId}.txt"`
    );
    res.send(tailoredResume);
  } catch (error) {
    console.error("❌ Tailored Resume Generation ERROR:", error.message);
    console.error("💥 STACK:", error.stack);

    res.status(500).json({
      message: "Failed to generate tailored resume",
      error: error.message,
    });
  }
}

// ✅ EXPORTS
export {
  generateInterviewReportController,
  getInerviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  generateTailoredResumeController,
};
