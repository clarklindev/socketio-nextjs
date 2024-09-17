import mongoose from "mongoose";
import Room from "../../../../lib/socket/chat/models/RoomModel.js";

export async function getRooms(req, res) {
  console.log("SERVER: getRooms()");
  const { ids } = req.query; // Expecting a comma-separated list of ids

  if (!ids) {
    return res.status(400).json({ error: "No ids provided" });
  }
  console.log("ids: ", ids);

  try {
    const objectIds = ids.split(",");

    //When you need to create ObjectId instances from hexadecimal strings, you should use the constructor with new
    const mongooseObjects = objectIds.map((id) => new mongoose.Types.ObjectId(id));

    const rooms = await Room.find({ _id: { $in: mongooseObjects } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
}
