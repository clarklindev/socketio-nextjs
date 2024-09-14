import { baseRoute, routes } from "../../../api/socket/routes/routePaths.js";

//receives namespace to get rooms from...
export async function getRooms(thisNs) {
  try {
    const apiUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}${baseRoute}${routes.ROOMS}`;
    //NOTE: thisNs.rooms is an array of IDs
    const queryParams = thisNs.rooms.map((id) => `${encodeURIComponent(id)}`).join(",");
    const fullUrl = `${apiUrl}?ids=${queryParams}`;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    // Handle error appropriately, possibly return a default value or rethrow
    return [];
  }
}
