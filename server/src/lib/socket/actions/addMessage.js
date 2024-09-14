import { baseRoute, routes } from "../../../api/socket/routes/routePaths.js";

//receives namespace to get rooms from...
export async function addMessage(messageObj) {
  console.log("FUNCTION addMessage(): messageObj: ", messageObj);
  try {
    const apiUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}${baseRoute}${routes.ROOMS_ADDMESSAGE}`;
    console.log("apiUrl: ", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageObj),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJSON = await response.json();
    console.log("responseJSON: ", responseJSON); //{room, message, newMessage}
    return responseJSON;
  } catch (error) {
    console.error("Failed to add message:", error);
    // Handle error appropriately, possibly return a default value or rethrow
    return [];
  }
}
