// CodeEditor.jsx
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import copy_icon from "../assets/svgs/copy_icon.svg";
import tick_icon from "../assets/svgs/tick_icon.svg";
import download_icon from "../assets/svgs/download_icon.svg";
import upload_icon from "../assets/svgs/upload_icon.svg";
import close_icon from "../assets/svgs/close_icon.svg";
import { downloadCode } from "../services/helper";

const RenameFile = ({
    fileName,
    setFileName,
    handleDownload,
    setRenamePrompt,
}) => {
    return (
        <div className="fixed top-0 z-60 left-0 h-full w-full backdrop-blur-sm">
            <div className="fixed top-[calc(50%-90px)] [@media(max-width:350px)]:left-[calc(50%-140px)] left-[calc(50%-175px)] h-[180px] bg-bg-scrim [@media(max-width:350px)]:w-[280px] w-[350px] rounded-[10px] border-[2px] border-bg-tertiary text-white ">
                <p className="text-barlow relative w-full bg-bg-primary rounded-t-[10px] p-[5px] px-[10px] text-[20px] font-medium">
                    Rename File
                </p>
                <p className="w-full p-[5px] px-[10px] text-white">
                    Enter file name without extension
                </p>
                <div className=" w-[90%] mt-[10px]">
                    <input
                        className="w-full text-text-secondary rounded-xl mx-4 px-4 py-2 focus:outline-none border border-bg-tertiary"
                        type="text"
                        name="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <div className="mt-[10px] flex w-full  justify-evenly">
                    <button
                        onClick={handleDownload}
                        className="h-[30px] w-[120px] rounded-[3px] bg-bg-tertiary text-[0.625rem] font-normal leading-[9px] hover:border hover:border-bg-tertiary  hover:bg-transparent md:text-base md:leading-[30px]"
                    >
                        Download
                    </button>
                    <button
                        onClick={() => setRenamePrompt(false)}
                        className="h-[30px] w-[120px] rounded-[3px] bg-bg-tertiary text-[0.625rem] font-normal leading-[9px] hover:border hover:border-bg-tertiary  hover:bg-transparent md:text-base md:leading-[30px]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const CodeEditor = ({ file, setFile, code, language, onChange, onClose }) => {
    const [codeCopied, setCodeCopied] = useState(false);
    const [download, setDownload] = useState(false);
    const [fileName, setFileName] = useState("code");
    const [renamePrompt, setRenamePrompt] = useState(false);
    const [uploadCode, setUploadCode] = useState(false);

    const handleUploadFile = async () => {
        // handle upload file.
    };

    const handleDownload = async () => {
        try {
            const downloaded = await downloadCode(fileName, code, language);
            if (downloaded) {
                setRenamePrompt(false);
                setDownload(true);
                setTimeout(() => setDownload(false), 2000);
            } else {
                throw new Error("Download Failed!");
            }
        } catch (err) {
            console.error(err);
        }
    };

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
        <>
            {renamePrompt && (
                <RenameFile
                    fileName={fileName}
                    setFileName={setFileName}
                    handleDownload={handleDownload}
                    setRenamePrompt={setRenamePrompt}
                />
            )}
            <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-bg-secondary z-50 shadow-lg overflow-auto">
                <div className="flex justify-between items-center p-4 border-b border-bg-tertiary">
                    <h2 className="text-white text-sm font-semibold">
                        {language.charAt(0).toUpperCase() + language.slice(1)}{" "}
                        Editor
                    </h2>
                    <div className="flex justify-center items-center">
                        {/* Upload Code Button  */}
                        {uploadCode === true ? (
                            <div className="p-2">
                                <img
                                    className="h-[24px] w-[24px]"
                                    src={tick_icon}
                                    alt="Uploaded"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleUploadFile}
                                className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                            >
                                <img
                                    src={upload_icon}
                                    alt="Upload Icon"
                                    className="w-[24px] h-[24px]"
                                />
                                <div className="absolute w-fit z-10 text-nowrap bottom-[-50px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Upload Code
                                </div>
                            </button>
                        )}

                        {/* Download Code Button  */}
                        {download === true ? (
                            <div className="p-2">
                                <img
                                    className="h-[24px] w-[24px]"
                                    src={tick_icon}
                                    alt="Downloaded"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setRenamePrompt(true)}
                                className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                            >
                                <img
                                    src={download_icon}
                                    alt="Download Icon"
                                    className="w-[24px] h-[24px]"
                                />
                                <div className="absolute w-fit z-10 text-nowrap bottom-[-50px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Download Code
                                </div>
                            </button>
                        )}

                        {/* Copy Button */}
                        {codeCopied === true ? (
                            <div className="p-2">
                                <img
                                    className="h-[24px] w-[24px]"
                                    src={tick_icon}
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
                                <div className="absolute w-fit z-10 text-nowrap bottom-[-50px] left-[20px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Copy Code
                                </div>
                            </button>
                        )}

                        {/* Close Button  */}
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
                    value={code}
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
        </>
    );
};

export default CodeEditor;
