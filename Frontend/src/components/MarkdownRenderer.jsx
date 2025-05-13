// MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const MarkdownRenderer = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    return !inline && match ? (
                        <div className="relative my-4 rounded-lg overflow-hidden border border-bg-tertiary bg-bg-scrim">
                            <div className="bg-bg-tertiary whitespace-pre-wrap text-white text-xs font-mono px-3 py-2 border-b border-bg-primary">
                                {language.toUpperCase()}
                            </div>
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={language}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    background: "transparent",
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code
                            className="bg-bg-tertiary break-all break-words whitespace-pre-wrap text-white px-1 py-0.5 rounded "
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                h1: ({ node, ...props }) => (
                    <h1 className="text-2xl leading-relaxed font-normal" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-xl leading-relaxed font-normal" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-lg leading-relaxed font-normal" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="leading-relaxed font-normal" {...props} />
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
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary text-nowrap bg-bg-tertiary rounded-full align-text-top px-3 pt-0.5 pb-1 hover:underline"
                        {...props}
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;