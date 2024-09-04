export const validateImageUrl = async (image_url, api_endpoint = "/api/validate/validateUrl") => {
  console.log("FUNCTION validateImageUrl(): ", image_url);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${api_endpoint}?url=${encodeURIComponent(image_url)}`
    );
    const data = await res.json();
    return data.valid;
  } catch (error) {
    console.error("Error validating image URL:", error);
    return false;
  }
};
