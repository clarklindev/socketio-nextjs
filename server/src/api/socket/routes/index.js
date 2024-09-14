import express from "express";
import { createNamespace } from "../actions/createNamespace.js";
import { addRoomToNamespace } from "../actions/addRoomToNamespace.js";
import { getNamespaces } from "../actions/getNamespaces.js";
import { getRooms } from "../actions/getRooms.js";
import { addMessage } from "../actions/addMessage.js";
import { validateUrl } from "../actions/validateUrl.js";
import { addUser } from "../actions/addUser.js";

import { routes } from "./routePaths.js";
import { getMessages } from "../actions/getMessages.js";

const router = express.Router();

//api/socket/namespaces
router.get(routes.NAMESPACES, getNamespaces);
router.post(routes.NAMESPACES, createNamespace);
router.post(routes.NAMESPACES_ADDROOM, addRoomToNamespace);

//api/socket/rooms
router.get(routes.ROOMS, getRooms);
router.post(routes.ROOMS_ADDMESSAGE, addMessage);
router.get(routes.ROOMS_GETMESSAGES, getMessages);

//api/socket/user
router.post(routes.USER_ADDUSER, addUser);

//api/socket
router.get(routes.DEFAULT_ROUTE, (req, res) => {
  res.json({ status: "OK" });
});

/*
"HEAD": Similar to GET, but it only retrieves the headers of the resource, not the content. 
This is often used to check the existence of a resource or to obtain metadata without downloading the full content.
*/
router.get(routes.VALIDATEURL, validateUrl);

export default router;
