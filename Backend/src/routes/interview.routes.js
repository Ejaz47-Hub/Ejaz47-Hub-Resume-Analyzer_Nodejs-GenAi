import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import { generateInterviewReportController,getAllInterviewReportsController,getInerviewReportByIdController } from "../controllers/interview.controller.js"; 

const interviewRouter = express.Router()

/**
 * @route Post /api/interview
 * @description generate new interview report on the basis of user self description ,resume pd and job description
 * @access private
 */
interviewRouter.post("/",authUser,upload.single("resume"),generateInterviewReportController)

/**
 *  @route Get/ api/interview/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser,getInerviewReportByIdController)

/**
 * @route Get/api/interview
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/",authUser,getAllInterviewReportsController)




export default interviewRouter