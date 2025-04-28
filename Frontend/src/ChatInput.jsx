import React, { useState } from "react";

const ChatInput = () => {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text && !image && !file) {
            alert("Please enter a message or upload a file/image.");
            return;
        }
        // if (!text) {
        //     alert("Please enter a message");
        //     return;
        // }
        // if (!text && image) {
        //     alert("Please enter a message");
        //     return;
        // }
        // if (!text && file) {
        //     alert("Please enter a message");
        //     return;
        // }

        const formData = new FormData();
        formData.append("text", text);
        if (image) formData.append("image", image);
        if (file) formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setResponse(data.response);
            alert("Server Error: "+ data.error);

            // Reset after submit
            setText("");
            setImage(null);
            setFile(null);

        } catch (error) {
            console.error("Error uploading:", error);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4 border rounded-xl shadow-md max-w-md mx-auto"
            >
                {/* Text Input */}
                <textarea
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="4"
                    cols="100"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {/* Upload Buttons */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        📷 Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        📄 Upload File
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Preview (Optional) */}
                <div className="flex flex-col gap-2">
                    {image && <div>Selected Image: {image.name}</div>}
                    {file && <div>Selected File: {file.name}</div>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Send
                </button>
            </form>
            {response && (
                <div className="p-4 mt-4 bg-gray-100 rounded-lg shadow-inner">
                    <h3 className="font-bold mb-2 text-gray-700">
                        AI Response:
                    </h3>
                    <p className="text-gray-800">{response}</p>
                </div>
            )}
        </>
    );
};

export default ChatInput;
