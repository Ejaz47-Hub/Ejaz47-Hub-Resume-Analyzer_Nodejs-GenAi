import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import dotenv from "./dotenv.js";
connectDB()
app.listen(3000,()=>{
    console.log("The server is running in 3000");    
})