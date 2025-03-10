import mongoose from "mongoose";

export async function connectToDatabase(uri, databaseName) {
  console.log("SERVER: STEP 01 - FUNCTION connectToDatabase()");
  try {
    //NOTE: does not work with VPN
    const result = await mongoose.connect(uri, { dbName: databaseName });
    console.log(`SERVER: connected to mongodb database: ${databaseName}`);
    return result;
  } catch (err) {
    throw new Error("SERVER: Failed to connect to database");
  }
}
