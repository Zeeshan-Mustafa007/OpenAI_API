import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_DEV_BACKEND_URL
        : import.meta.env.VITE_PROD_BACKEND_URL;

if (!BASE_URL) {
    throw new Error(
        "Backend URL is not defined. Please set the BACKEND_URL environment variable."
    );
}

// CHAT

export const fetchChatHistory = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/chat/history`);
        const data = res.data;
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
        const res = await axios.post(`${BASE_URL}/chat/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const data = res.data;
        if (data.error) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error("Error uploading chat data:", error);
        throw error;
    }
};

// USERS

export const googleLogin = async (code) => {
    const response = await axios.post(`${BASE_URL}/user/googleLogin`, {
        code,
    });
    console.log(response.data.user);
    return response.data.user;
};

export const autoGoogleLogin = async (id) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/autoGoogleLogin`, {
            id,
        });
        return response.data.user;
    } catch (error) {
        console.error("Error during auto-login:", error);
        throw error;
    }
};
