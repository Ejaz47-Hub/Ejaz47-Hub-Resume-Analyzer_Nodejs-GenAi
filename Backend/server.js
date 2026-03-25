import dotenv from "dotenv";
dotenv.config(); // ✅ still good practice


import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("The server is running on port 3000");
});