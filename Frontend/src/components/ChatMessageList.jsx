import React from "react";

const ChatMessageList = ({webSearch, messages, loading, messagesEndRef }) => {
    return (
        <div className="w-full flex-grow overflow-y-auto py-6 ">
            <div className="w-full flex flex-col items-center">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[60%] w-full mb-4 flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={` px-4 py-3 text-white text-[16px] font-[400] whitespace-pre-wrap ${
                                msg.role === "user"
                                    ? "bg-[#303030] relative max-w-[var(--user-chat-width,70%)] bg-token-message-surface rounded-3xl px-5 py-2.5"
                                    : "bg-transparent leading-[28px]"
                            }`}
                        >
                            {msg?.content[0]?.text?.value || "[No content]"}
                        </div>
                    </div>
                ))}
                {messages.length === 0 && !loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#292A2D] text-gray-100 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 text-center italic">
                                No messages yet. Start the conversation!
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#292A2D] flex justify-center items-center gap-2 text-gray-100 p-4 rounded-lg">
                            {webSearch && loading && (
                                <div className="text-md text-gray-400 text-center italic">
                                    Searching the web
                                </div>
                            )}
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessageList;
