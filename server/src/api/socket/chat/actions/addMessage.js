import Message from "../../../../lib/socket/chat/models/MessageModel.js";
import Room from "../../../../lib/socket/chat/models/RoomModel.js";

export async function addMessage(req, res, next) {
  try {
    const { message, date, userId, avatar, roomId, endpoint } = req.body;
    console.log("API addMessage: ", req.body);

    // Validate input
    if (!message || !userId || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Create a new message document
    const msg = new Message(req.body);

    console.log("SERVER API: ", msg);
    // Save the message to the database
    const savedMessage = await msg.save();
    // // Find the room by ID and update its history
    // //NOTE: populate() enhances query results by expanding returned data
    // //so instead of returning history with array of message IDs, it returns the "populated" information
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $push: { history: savedMessage._id } },
      { new: true, useFindAndModify: false } // Return the updated room document
    ).populate(
      "history" //which is an array of "Message" objects
    );
    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    // Respond with the updated room and message
    res.status(200).json({
      status: "Message added successfully",
      room: updatedRoom, // Includes the updated room and its populated history
      newMessage: savedMessage,
    });
  } catch (error) {
    console.error("Failed to add message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
