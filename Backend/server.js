import dotenv from "dotenv";
dotenv.config(); // ✅ still good practice

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ The server is running on port 3000");
});
