import React, { useState, useEffect, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const ChatContainer = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [webSearch, setWebSearch] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchChatHistory = async () => {
        try {
            const res = await fetch("http://localhost:5000/history");
            const data = await res.json();
            if (Array.isArray(data.messages)) {
                setChatHistory(data.messages);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSubmit = async () => {
        if (!text && !image && !file) {
            alert("Please enter a message or upload a file/image.");
            return;
        }

        const formData = new FormData();
        formData.append("text", text);
        formData.append("webSearch", webSearch);
        if (image) formData.append("image", image);
        if (file) formData.append("file", file);

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.error) {
                alert("Server error: " + data.error);
            }
            await fetchChatHistory();
            setText("");
            setImage(null);
            setFile(null);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#212121] text-gray-100 ">
            <ChatMessageList
                webSearch={webSearch}
                messages={chatHistory}
                loading={loading}
                messagesEndRef={messagesEndRef}
            />
            <ChatInput
                className=""
                text={text}
                setText={ setText }
                image={image}
                setImage={ setImage }
                file={file}
                setFile={setFile}
                onSubmit={handleSubmit}
                webSearch={webSearch}
                setWebSearch={setWebSearch}
                loading={loading}
            />
        </div>
    );
};

export default ChatContainer;
