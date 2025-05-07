import React, { useState, useEffect, useRef } from "react";

const ChatInput4 = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !image && !file) {
            alert("Please enter a message or upload a file/image.");
            return;
        }

        const formData = new FormData();
        formData.append("text", text);
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
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            {/* Chat Window */}
            <div className="flex-grow overflow-y-auto px-4 py-6">
                {chatHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`w-full mb-4 flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-xl px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow ${
                                msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                            }`}
                        >
                            {msg?.content[0]?.text?.value || "[No content]"}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-sm text-gray-400 text-center italic">
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 border-t border-gray-700 p-4"
            >
                <div className="flex items-end gap-3">
                    {/* Upload Buttons */}
                    <div className="flex gap-2">
                        <label className="cursor-pointer text-gray-400 hover:text-white">
                            📷
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                        <label className="cursor-pointer text-gray-400 hover:text-white">
                            📎
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </label>
                    </div>

                    {/* Text Input */}
                    <textarea
                        rows={1}
                        className="flex-grow resize-none bg-gray-700 text-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                        placeholder="Send a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                        ➤
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput4;
