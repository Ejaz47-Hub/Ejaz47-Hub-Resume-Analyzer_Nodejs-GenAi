import express from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
} from "../controllers/auth.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

/* @route Post api/auth/register
    @description  Register a new user
    @access Public
*/
authRouter.post("/register", registerUserController);

/**
 * @route post api/auth/login
 * @description login the existing user
 * @access Public
 */
authRouter.post("/login", loginUserController);

/**
 * @route Get/ api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get("/logout", logoutUserController);

/**
 * @route Get /api/auth/get-me
 * @description Get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authUser, getMeController);

export default authRouter;
