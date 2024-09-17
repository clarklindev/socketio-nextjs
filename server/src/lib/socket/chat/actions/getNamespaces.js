import { routes, baseRoute } from "../../../../api/socket/chat/routes/routePaths.js";

export async function getNamespaces() {
  try {
    const apiUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}${baseRoute}${routes.NAMESPACES}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.error("Failed to fetch namespaces:", error);
    // Handle error appropriately, possibly return a default value or rethrow
    return [];
  }
}
