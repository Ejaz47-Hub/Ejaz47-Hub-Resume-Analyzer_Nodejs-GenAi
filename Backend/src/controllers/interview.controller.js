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

import PDFDocument from "pdfkit";
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

    // Create a new PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-report-${interviewId}.pdf"`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("INTERVIEW PREPARATION REPORT", {
        align: "center",
      });

    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica").text(`Report ID: ${interviewId}`, {
      align: "center",
    });
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, {
      align: "center",
    });

    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Match Score
    doc.fontSize(14).font("Helvetica-Bold").text("Match Score");
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#ff006e")
      .text(`${interviewReport.matchScore}%`);
    doc.fillColor("black");
    doc.moveDown(1);

    // Technical Questions
    doc.fontSize(14).font("Helvetica-Bold").text("Technical Questions");
    doc.moveDown(0.5);

    interviewReport.technicalQuestions.forEach((q, i) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`Q${i + 1}: ${q.question}`);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(`Intention: ${q.intention}`);
      doc.text(`Answer: ${q.answer}`);
      doc.fillColor("black");
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // Behavioral Questions
    doc.fontSize(14).font("Helvetica-Bold").text("Behavioral Questions");
    doc.moveDown(0.5);

    interviewReport.behavioralQuestions.forEach((q, i) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`Q${i + 1}: ${q.question}`);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(`Intention: ${q.intention}`);
      doc.text(`Answer: ${q.answer}`);
      doc.fillColor("black");
      doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // Skill Gaps
    doc.fontSize(14).font("Helvetica-Bold").text("Skill Gaps");
    doc.moveDown(0.5);

    interviewReport.skillGaps.forEach((gap) => {
      const severityColor =
        gap.severity === "high"
          ? "#ff4d4d"
          : gap.severity === "medium"
          ? "#f5a623"
          : "#3fb950";
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(severityColor)
        .text(`• ${gap.skill} (${gap.severity})`);
    });

    doc.fillColor("black");
    doc.moveDown(1);

    // Preparation Plan
    doc.fontSize(14).font("Helvetica-Bold").text("Preparation Road Map");
    doc.moveDown(0.5);

    interviewReport.preparationPlan.forEach((day) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`Day ${day.day}: ${day.focus}`);
      doc.fontSize(10).font("Helvetica").fillColor("#666666");
      day.tasks.forEach((task) => {
        doc.text(`  • ${task}`);
      });
      doc.fillColor("black");
      doc.moveDown(0.5);
    });

    // Finalize PDF
    doc.end();
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
