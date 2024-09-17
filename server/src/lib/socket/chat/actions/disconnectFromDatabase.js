import mongoose from "mongoose";

// Disconnect from MongoDB
export async function disconnectFromDatabase() {
  try {
    console.log("SERVER: STEP CLEANUP - FUNCTION disconnectFromDatabase()");
    await mongoose.disconnect();
    console.log("SERVER: Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}
