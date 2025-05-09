import React, { useState, useEffect, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import Header from "./header";

const ChatContainer = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [webSearch, setWebSearch] = useState(false);
    const [reason, setReason] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchChatHistory = async () => {
        try {
            // const res = await fetch("http://localhost:5000/chat/history");
            const res = await fetch(
                "https://chatbackend.brainyte.com/chat/history"
            );
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
        const formData = new FormData();
        formData.append("text", text);
        formData.append("webSearch", webSearch);
        if (image) formData.append("image", image);
        if (file) formData.append("file", file);

        setLoading(true);

        try {
            const res = await fetch(
                "https://chatbackend.brainyte.com/chat/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            await fetchChatHistory();
            setText("");
            setImage(null);
            setFile(null);
        } catch (err) {
            console.error("Upload error:", err);
            setText("");
            setImage(null);
            setFile(null);
        } finally {
            setLoading(false);
            setText("");
            setImage(null);
            setFile(null);
        }
    };

    return (
        <div className="ChatContainer ">
            <div className="flex items-center justify-center h-screen flex-col">
                <div className="absolute top-0 w-full bg-bg-primary lg:bg-transparent">
                    <Header />
                </div>
                {chatHistory.length === 0 && !loading && (
                    <div className="flex justify-start p-8">
                        <div className="text-[28px] font-[600] leading-[28px] text-white">
                            What can I help with?
                        </div>
                    </div>
                )}
                {(chatHistory.length !== 0 || loading) && (
                    <ChatMessageList
                        webSearch={webSearch}
                        messages={chatHistory}
                        loading={loading}
                        messagesEndRef={messagesEndRef}
                    />
                )}

                <ChatInput
                    text={text}
                    setText={setText}
                    image={image}
                    setImage={setImage}
                    file={file}
                    setFile={setFile}
                    onSubmit={handleSubmit}
                    webSearch={webSearch}
                    setWebSearch={setWebSearch}
                    reason={reason}
                    setReason={setReason}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ChatContainer;
