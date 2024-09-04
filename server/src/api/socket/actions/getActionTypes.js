import { actionTypes } from "../../../types/ServerTypes.js";

export async function getActionTypes(req, res) {
  try {
    res.json(actionTypes);
  } catch (error) {
    console.error("Error fetching actionTypes:", error);
    res.status(500).json({ error: "Error fetching actionTypes" });
  }
}
