const mimeTypes = {
    javascript: "text/javascript",
    typescript: "application/typescript",
    python: "text/x-python",
    java: "text/x-java-source",
    csharp: "text/x-csharp",
    cpp: "text/x-c++src",
    c: "text/x-csrc",
    ruby: "text/x-ruby",
    php: "application/x-httpd-php",
    swift: "text/x-swift",
    kotlin: "text/x-kotlin",
    go: "text/x-go",
    rust: "text/rust",
    scala: "text/x-scala",
    perl: "text/x-perl",
    bash: "application/x-sh",
    shell: "application/x-sh",
    html: "text/html",
    css: "text/css",
    json: "application/json",
    xml: "application/xml",
    yaml: "text/yaml",
    markdown: "text/markdown",
    sql: "application/sql",
    r: "text/r",
    dart: "application/dart",
    lua: "text/x-lua",
};

const extensions = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    csharp: "cs",
    cpp: "cpp",
    c: "c",
    ruby: "rb",
    php: "php",
    swift: "swift",
    kotlin: "kt",
    go: "go",
    rust: "rs",
    scala: "scala",
    perl: "pl",
    bash: "sh",
    shell: "sh",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    markdown: "md",
    sql: "sql",
    r: "r",
    dart: "dart",
    lua: "lua",
};
export const downloadCode = (codeContent, language) => {
    try {
        const mimeType = mimeTypes[language] || "text/plain";
        const extension = extensions[language] || "txt";

        const blob = new Blob([codeContent], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const filename =
            prompt("Enter filename (without extension):", "code") || "code";
        link.download = `${filename}.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error("Download failed", error);
        return false;
    }
};

export const handleCodeEditorFileUpload = async (file, setFile, code, language) => {};


