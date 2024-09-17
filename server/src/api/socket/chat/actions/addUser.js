import bcrypt from "bcrypt";
import User from "../../../../lib/socket/chat/models/UserModel.js";

export async function addUser(req, res, next) {
  console.log("FUNCTION addUser():");
  // console.log("SERVER API addUser: ", req.body);

  const { email, name, password } = req.body;
  const saltRounds = 10; // Number of salt rounds (work factor)

  try {
    // Generate a salt and hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create a new user with the hashed password
    const newUser = new User({
      email,
      name,
      hashedPassword, // Store the hashed password
      // Add other required fields
    });
    const savedUser = await newUser.save();
    console.log("User created successfully:", savedUser);
    // Send the response as JSON
    res.status(201).json({ savedUser });
  } catch (error) {
    console.error("Failed to add user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
