// CodeEditor.jsx
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import copy_icon from "../assets/svgs/copy_icon.svg";
import copied_icon from "../assets/svgs/copied_icon.svg";
import download_icon from "../assets/svgs/download_icon.svg";
import close_icon from "../assets/svgs/close_icon.svg";

const CodeEditor = ({ code, language, onChange, onClose }) => {
    const [codeCopied, setCodeCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };
    return (
        <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-bg-secondary z-50 shadow-lg overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-bg-tertiary">
                <h2 className="text-white text-sm font-semibold">
                    {language.charAt(0).toUpperCase() + language.slice(1)}{" "}
                    Editor
                </h2>
                <div className="flex justify-center items-center">
                    {codeCopied === true ? (
                        <div className="p-2">
                            <img
                                className="h-[24px] w-[24px]"
                                src={copied_icon}
                                alt="Copied"
                            />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                        >
                            <img
                                src={copy_icon}
                                alt="Copy Icon"
                                className="w-[24px] h-[24px]"
                            />
                            <div className="absolute w-fit z-10 text-nowrap bottom-[-40px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                Copy Code
                            </div>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                    >
                        <img
                            src={close_icon}
                            alt="Close Icon"
                            className="w-[24px] h-[24px]"
                        />
                    </button>
                </div>
            </div>
            <MonacoEditor
                height="calc(100% - 50px)"
                defaultLanguage={language}
                defaultValue={code}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    padding: { top: 10, bottom: 10 },
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    formatOnType: true,
                    formatOnPaste: true,
                    autoIndent: "full",
                }}
            />
        </div>
    );
};

export default CodeEditor;
