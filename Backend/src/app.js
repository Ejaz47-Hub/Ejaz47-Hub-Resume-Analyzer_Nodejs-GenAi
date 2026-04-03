import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://capable-queijadas-927118.netlify.app", // ✅ your Netlify frontend
        // ✅ Add your Render URL here after deployment
       " https://ejaz47-hub-resume-analyzer-nodejs-genai.onrender.com"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Health check endpoint for Render + cron-job.org
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;