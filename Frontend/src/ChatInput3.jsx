import React, { useState, useEffect } from "react";

const ChatInput3 = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchChatHistory = async () => {
        try {
            const res = await fetch("http://localhost:5000/history");
            const data = await res.json();
            if (Array.isArray(data.messages)) {
                // console.log("data.messages");
                // console.log(data.messages);
                setChatHistory(data.messages);
            } else {
                console.warn("Unexpected history response format");
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

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

            // Refresh chat history after sending
            await fetchChatHistory();

            // Reset fields
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
        <div className="max-w-xl mx-auto p-4 space-y-4">
            {/* Chat History */}
            <div className="bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-auto shadow-inner">
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded ${
                            msg.role === "user"
                                ? "bg-blue-100 text-right"
                                : "bg-green-100 text-left"
                        }`}
                    >
                        <p className="whitespace-pre-wrap">
                            
                            {/* {console.log("msg") }
                            { console.log(msg) } */}
                            {msg.role === "user" ? "[ You ]: " : "[ Assistant ]: "}
                            {msg.content[0]?.text?.value || "[No content]"}
                        </p>
                    </div>
                ))}
                {loading && (
                    <div className="text-gray-500 italic">Thinking...</div>
                )}
            </div>

            {/* Chat Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 border p-4 rounded-lg shadow-md"
            >
                <textarea
                    className="border p-2 rounded resize-none"
                    rows="4"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <label className="cursor-pointer">
                        📷 Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && <div>Selected: {image.name}</div>}
                    </label>

                    <label className="cursor-pointer">
                        📄 Upload File
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        {file && <div>Selected: {file.name}</div>}
                    </label>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInput3;
