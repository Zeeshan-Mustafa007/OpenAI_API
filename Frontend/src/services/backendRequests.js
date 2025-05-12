
const BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_DEV_BACKEND_URL
        : import.meta.env.VITE_PROD_BACKEND_URL;

// console.log("Backend URL:", BASE_URL);
if (!BASE_URL) {
    throw new Error(
        "Backend URL is not defined. Please set the BACKEND_URL environment variable."
    );
}

export const fetchChatHistory = async () => {
    try {
        const res = await fetch(`${BASE_URL}/chat/history`);
        const data = await res.json();
        if (Array.isArray(data.messages)) {
            return data.messages;
        }
        throw new Error("Invalid response format");
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};

export const uploadChatData = async ({ text, webSearch, image, file }) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("webSearch", webSearch);
    if (image) formData.append("image", image);
    if (file) formData.append("file", file);

    try {
        const res = await fetch(`${BASE_URL}/chat/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error("Error uploading chat data:", error);
        throw error;
    }
};
