import express from "express";
import authUser from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js";
import {
  generateInterviewReportController,
  getAllInterviewReportsController,
  getInerviewReportByIdController,
  generateResumePdfController,
  generateTailoredResumeController,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route Post /api/interview
 * @description generate new interview report on the basis of user self description ,resume pd and job description
 * @access private
 */
interviewRouter.post(
  "/",
  authUser,
  upload.single("resume"),
  generateInterviewReportController
);

/**
 *  @route Post /api/interview/resume/pdf/:interviewId
 * @description generate PDF from interview report
 * @access private
 */
interviewRouter.post(
  "/resume/pdf/:interviewId",
  authUser,
  generateResumePdfController
);

/**
 *  @route Post /api/interview/resume/tailored/:interviewId
 * @description generate AI-tailored resume for the target job
 * @access private
 */
interviewRouter.post(
  "/resume/tailored/:interviewId",
  authUser,
  generateTailoredResumeController
);

/**
 *  @route Get/ api/interview/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  authUser,
  getInerviewReportByIdController
);

/**
 * @route Get/api/interview
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsController);

export default interviewRouter;
