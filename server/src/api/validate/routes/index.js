import express from "express";

import { routes } from "./routePaths.js";
import { isImage } from "../actions/isImage.js";

const router = express.Router();

//api/validate
router.get(routes.DEFAULT_ROUTE, (req, res) => {
  res.json({ status: "OK" });
});
//api/validate/is-image
router.get(routes.IMAGE, isImage);

export default router;
