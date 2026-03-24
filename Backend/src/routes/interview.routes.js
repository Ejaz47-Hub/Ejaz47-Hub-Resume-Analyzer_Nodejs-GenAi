import express from "express";
import authUser from "../middlewares/auth.middleware";
const interviewRouter = express.Router()

/**
 * @route Post /api/interview
 * @description generate new interview report on the basis of user self description ,resume pd and job description
 * @access private
 */
interviewRouter.post("/",authUser)

export default interviewRouter