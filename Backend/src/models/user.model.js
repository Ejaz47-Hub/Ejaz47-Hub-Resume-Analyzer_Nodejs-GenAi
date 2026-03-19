import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username alredy taken"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "email alredy taken"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const userModel = mongoose.model("users", userSchema);
export default userModel;
