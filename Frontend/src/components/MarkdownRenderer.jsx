// MarkdownRenderer.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import copy_icon from "../assets/svgs/copy_icon.svg";
import copied_icon from "../assets/svgs/copied_icon.svg";
import editCode_icon from "../assets/svgs/editCode_icon.svg";
import CodeEditor from "./CodeEditor";

const MarkdownRenderer = ({ content }) => {
    const [copied, setCopied] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [editorLanguage, setEditorLanguage] = useState("javascript");

    const handleCopy = async (text, setCopied) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const openEditor = (code, language) => {
        setEditorContent(code);
        setEditorLanguage(language);
        setEditorOpen(true);
    };

    const closeEditor = () => {
        setEditorOpen(false);
    };

    const handleEditorChange = (value) => {
        setEditorContent(value);
        // You can also update the original markdown content here if needed
    };

    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        const codeString = String(children).replace(/\n$/, "");

                        return !inline && match ? (
                            <div className="my-4 relative w-full rounded-lg border border-bg-tertiary bg-bg-scrim">
                                <div className="flex font-sans justify-between items-center bg-bg-secondary text-white text-xs px-3 py-2 border-b border-bg-primary">
                                    <span>{language.toUpperCase()}</span>
                                </div>
                                <div className="sticky top-9">
                                    <div className="flex absolute bottom-[6px] right-2 z-10 items-center gap-8 bg-bg-secondary px-3 py-0.5 rounded">
                                        {/* Copy Code Button */}
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    codeString,
                                                    setCopied
                                                )
                                            }
                                            className="text-xs text-white cursor-pointer flex items-center gap-1"
                                        >
                                            {copied ? (
                                                <>
                                                    <img
                                                        className="h-3 w-3"
                                                        src={copied_icon}
                                                        alt="Copied"
                                                    />{" "}
                                                    <span>Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <img
                                                        className="h-3 w-3"
                                                        src={copy_icon}
                                                        alt="Copy"
                                                    />{" "}
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                        {/* Edit Code Button */}
                                        <button
                                            onClick={() =>
                                                openEditor(codeString, language)
                                            }
                                            className="text-xs text-white cursor-pointer flex items-center gap-1"
                                        >
                                            <img
                                                className="h-3 w-3"
                                                src={editCode_icon}
                                                alt="Edit"
                                            />{" "}
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto ">
                                    <pre className="min-w-full overflow-x-auto">
                                        <SyntaxHighlighter
                                            style={ vscDarkPlus }
                                            language={language}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                background: "transparent",
                                                whiteSpace: "pre",
                                                overflowX: "auto",
                                            }}
                                            {...props}
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <code
                                className="bg-bg-tertiary break-normal break-words text-wrap text-white px-1 py-0.5 rounded"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    h1: ({ node, ...props }) => (
                        <h1
                            className="text-2xl leading-relaxed font-semibold"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2
                            className="text-xl leading-relaxed font-semibold"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3
                            className="text-lg leading-relaxed font-normal"
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <p
                            className="!break-normal !whitespace-normal leading-relaxed font-normal"
                            {...props}
                        />
                    ),
                    li: ({ node, ...props }) => (
                        <li
                            className="relative leading-relaxed ml-6 list-disc"
                            {...props}
                        />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc leading-relaxed" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol
                            className=" list-decimal ml-6 leading-relaxed"
                            {...props}
                        />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr className="border-t border-bg-tertiary my-4" />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-gray-500 pl-4 italic "
                            {...props}
                        />
                    ),
                    a: ({ node, ...props }) => (
                        <div className="bg-bg-tertiary inline-flex rounded-full w-fit px-5 pt-1 pb-1.5 ">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary break-normal text-wrap hover:underline"
                                {...props}
                            />
                        </div>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
            {editorOpen && (
                <CodeEditor
                    code={editorContent}
                    language={editorLanguage}
                    onChange={handleEditorChange}
                    onClose={closeEditor}
                />
            )}
        </div>
    );
};

export default MarkdownRenderer;
