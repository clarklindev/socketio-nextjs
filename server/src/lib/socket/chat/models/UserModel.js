import mongoose, { Schema } from "mongoose";

// Define the User schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
