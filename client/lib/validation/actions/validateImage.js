export const validateImage = async (image_url, api_endpoint = "/api/validate/image") => {
  console.log("FUNCTION validateImageUrl(): ", image_url);

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}${api_endpoint}?url=${encodeURIComponent(
      image_url
    )}`;
    const res = await fetch(fullUrl);
    const data = await res.json();
    return data.valid;
  } catch (error) {
    console.error("Error validating image URL:", error);
    return false;
  }
};
