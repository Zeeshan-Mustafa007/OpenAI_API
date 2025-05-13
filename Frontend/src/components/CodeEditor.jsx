// CodeEditor.jsx
import React from "react";
import MonacoEditor from "@monaco-editor/react";

const CodeEditor = ({ code, language, onChange, onClose }) => {
    return (
        <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-bg-secondary z-50 shadow-lg overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-bg-tertiary">
                <h2 className="text-white text-sm font-semibold">
                    {language.toUpperCase()} Editor
                </h2>
                <button onClick={onClose} className="text-white text-sm">
                    Close
                </button>
            </div>
            <MonacoEditor
                height="calc(100% - 50px)"
                defaultLanguage={language}
                defaultValue={code}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                }}
            />
        </div>
    );
};

export default CodeEditor;
