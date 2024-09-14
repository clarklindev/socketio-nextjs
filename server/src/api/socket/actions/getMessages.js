import mongoose from "mongoose";
import Message from "../../../lib/socket/db/models/MessageModel.js";

export async function getMessages(req, res) {
  const { ids } = req.query; // Expecting a comma-separated list of ids

  if (!ids) {
    return res.status(400).json({ error: "No ids provided" });
  }
  console.log("ids: ", ids); //message ids

  try {
    const objectIds = ids.split(",");

    //When you need to create ObjectId instances from hexadecimal strings, you should use the constructor with new
    const mongooseObjects = objectIds.map((id) => new mongoose.Types.ObjectId(id));

    const messages = await Message.find({ _id: { $in: mongooseObjects } });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
}
