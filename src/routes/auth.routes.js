import express from "express"
import {registerUserController,loginUserController} from "../controllers/auth.controller.js";

const authRouter = express.Router()
 
/* @route Post api/auth/register
    @description  Register a new user
    @access Public
*/ 
authRouter.post("/register",registerUserController)

/**
 * @route post api/auth/login
 * @description login the existing user
 * @access Public
 */
authRouter.post("/login",loginUserController)



export default authRouter;