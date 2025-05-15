import React, { useState, useEffect, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import Header from "./Header";
import { fetchChatHistory, uploadChatData } from "../services/backendRequests";

const ChatContainer = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [webSearch, setWebSearch] = useState(false);
    const [reason, setReason] = useState(false);
    const messagesEndRef = useRef(null);

    const loadChatHistory = async () => {
        try {
            const messages = await fetchChatHistory();
            setChatHistory(messages);
        } catch (error) {
            console.error("Failed to load chat history:", error);
        }
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            await uploadChatData({ text, webSearch, image, file });
            await loadChatHistory();
            setText("");
            setImage(null); // Reset only on success
            setFile(null); // Reset only on success
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ChatContainer">
            <div className="flex items-center justify-center h-dvh flex-col">
                <div className="absolute top-0 z-30  w-full bg-bg-primary lg:bg-transparent">
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
                        file={file}
                        setFile={setFile}
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
