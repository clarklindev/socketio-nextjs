export async function addUser(userObj) {
  try {
    console.log("before fetch()...");
    const api_endpoint = "/api/socket/chat/user/add-user";
    const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${api_endpoint}`;
    const res = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    });

    console.log("after fetch()...");
    const data = await res.json();
    console.log("returned from server: add-user/ data: ", data);
    return data;
  } catch (error) {
    console.error("Error adding user", error);
    return null;
  }
}
