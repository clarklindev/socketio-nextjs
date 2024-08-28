import express from "express";
import { createNamespace } from "../actions/createNamespace.js";
import { addRoomToNamespace } from "../actions/addRoomToNamespace.js";
import { getNamespaces } from "../actions/getNamespaces.js";
import { getRooms } from "../actions/getRooms.js";

const router = express.Router();

//api/socket/namespaces
router.get("/namespaces", getNamespaces);
router.post("/namespaces", createNamespace);
router.post("/namespaces/add-room", addRoomToNamespace);

//api/socket/rooms
router.get('/rooms', getRooms);

//api/socket
router.get("/", (req, res) => {
  res.json({ status: "OK" });
});

export default router;
