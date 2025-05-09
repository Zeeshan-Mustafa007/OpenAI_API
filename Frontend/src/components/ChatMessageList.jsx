import React from "react";

const ChatMessageList = ({ webSearch, messages, loading, messagesEndRef }) => {
    return (
        <div className="ChatMessageList w-full flex-grow overflow-y-auto">
            <div className="w-full flex flex-col items-center ">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[90%] md:max-w-[57%] w-full mb-4 flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <p
                            className={`break-all break-words px-4 py-3 text-white text-[16px] font-[400] whitespace-pre-wrap ${
                                msg.role === "user"
                                    ? "bg-bg-secondary relative max-w-[var(--user-chat-width,70%)]  rounded-3xl px-5 py-2.5 mx-4"
                                    : "bg-transparent leading-[28px]"
                            }`}
                        >
                            {msg?.content[0]?.text?.value || "[No content]"}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="w-full flex flex-col items-center">
                {loading && (
                    <div className="max-w-[90%] md:max-w-[57%] w-full px-4 flex justify-start">
                        <div className="bg-bg-secondary flex justify-center items-center gap-2 text-text-secondary p-4 rounded-lg">
                            {webSearch && loading && (
                                <div className="text-md text-text-tertiary text-center italic">
                                    Searching the web
                                </div>
                            )}
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessageList;
