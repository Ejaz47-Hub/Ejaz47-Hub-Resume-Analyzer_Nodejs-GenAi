import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");
import { generateInterviewReport } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

async function generateInterviewReportController(req,res){
    const resumeFile = req.file

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })
    res.status(201).json({
        message:"Interview report Generated Succesfully",
        interviewReport
    })
}

/**
 * @description Controller to get interview report By interviewId
 */
async function getInerviewReportByIdController(req,res){
    const {interviewId} = req.params

    const interviewreport = await interviewReportModel.findOne({
        _id:interviewId,
        user:req.user.id
    })

    if(!interviewreport){
        return res.status(404).json({
        message:"Interview report not found",
        })
    }

    res.status(200).json({
        message:"Interview report fetched sucessfully",
        interviewreport
    })
}

export { generateInterviewReportController, getInerviewReportByIdController}