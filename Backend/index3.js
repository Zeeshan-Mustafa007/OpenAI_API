const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { OpenAI, toFile } = require("openai");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

let THREAD_ID;

const configPath = path.resolve(__dirname, "config.json");

// ✅ Helper function to read from JSON file
function readConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}), "utf8"); // Create file if not present
    }
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
}

// ✅ Helper function to write to JSON file
function writeConfig(key, value) {
    const config = readConfig();
    config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

// ✅ Create Thread if needed
async function ensureThread() {
    const config = readConfig();
    THREAD_ID = config.THREAD_ID;

    if (!THREAD_ID) {
        const thread = await openai.beta.threads.create();
        THREAD_ID = thread.id;
        writeConfig("THREAD_ID", THREAD_ID);
        console.log("✨ Thread created:", THREAD_ID);
    } else {
        console.log("✅ Using existing Thread ID:", THREAD_ID);
    }
}

// 🔁 Check thread on server start
(async () => {
    await ensureThread();
})();

// 📨 POST /upload

app.post(
    "/upload",
    upload.fields([{ name: "image" }, { name: "file" }]),
    async (req, res) => {
        const { text } = req.body;
        const image = req.files["image"]?.[0];
        const file = req.files["file"]?.[0];

        // if (!text) return res.status(400).json({ error: "Text is required." });

        try {
            const messageContent = [{ type: "text", text }];

            let imageFile, uploadedFile;

            // Upload image or file to OpenAI
            if (image) {
                imageFile = await openai.files.create({
                    file: await toFile(image.buffer, image.originalname),
                    purpose: "user_data",
                });
                // console.log("Image file created:", imageFile.id);
            } else if (file) {
                uploadedFile = await openai.files.create({
                    file: await toFile(file.buffer, file.originalname),
                    purpose: "user_data",
                });
                // console.log("file created:", uploadedFile.id);
            }

            // Send message + Image to thread
            if (image && imageFile) {
                const base64Image = image.buffer.toString("base64");
                const mimeType = image.mimetype || "image/jpeg"; // fallback if not present

                const response = await openai.responses.create({
                    model: "gpt-4.1",
                    tools: [{ type: "web_search_preview" }],
                    input: [
                        {
                            role: "user",
                            content: [
                                { type: "input_text", text: text },
                                {
                                    type: "input_image",
                                    image_url: `data:${mimeType};base64,${base64Image}`,
                                },
                            ],
                        },
                    ],
                });

                console.log("Sending message + image to thread:", imageFile.id);

                // Sending user message + image to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "user",
                    content: [
                        { type: "text", text },
                        {
                            type: "image_file",
                            image_file: {
                                file_id: imageFile.id, // This comes from openai.files.create
                            },
                        },
                    ],
                });

                // Sending assistant response to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "assistant",
                    content: [{ type: "text", text: response.output_text }],
                });

                // console.log('OpenAI response:', response.output_text);
                return res.json({
                    response: response.output_text,
                });
            }
            // Send message + File to thread
            else if (file && uploadedFile) {
                // Convert buffer to base64 string
                const base64String = file.buffer.toString("base64");
                const mimeType = file.mimetype || "application/octet-stream";

                const response = await openai.responses.create({
                    model: "gpt-4.1",
                    tools: [{ type: "web_search_preview" }],
                    input: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "input_file",
                                    filename: file.originalname,
                                    file_data: `data:${mimeType};base64,${base64String}`,
                                },
                                {
                                    type: "input_text",
                                    text: text,
                                },
                            ],
                        },
                    ],
                });

                // sending user message + file to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "user",
                    content: messageContent,
                    attachments: [
                        {
                            file_id: uploadedFile.id,
                            tools: [{ type: "file_search" }],
                        },
                    ],
                });

                // sending assistant response to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "assistant",
                    content: [{ type: "text", text: response.output_text }],
                });

                // console.log("OpenAI file-text response:", response);
                return res.json({
                    response: response.output_text,
                });
            }
            // Send message to thread
            else {
                const response = await openai.responses.create({
                    model: "gpt-4.1",
                    tools: [{ type: "web_search_preview" }],
                    input: text,
                });

                // Sending user message to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "user",
                    content: messageContent,
                });

                // Sending assistant response to thread
                await openai.beta.threads.messages.create(THREAD_ID, {
                    role: "assistant",
                    content: [{ type: "text", text: response.output_text }],
                });

                return res.json({
                    response: response.output_text,
                });
            }
        } catch (err) {
            // console.error("Assistant error:", err);
            res.status(500).json({ error: "Something went wrong." });
        }
    }
);

// 📜 GET /history - Returns full chat from OpenAI thread
app.get("/history", async (req, res) => {
    try {
        const messages = await openai.beta.threads.messages.list(THREAD_ID);
        res.json({ messages: messages.data.reverse() }); // Chronological order
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to retrieve chat history." });
    }
});

// 🟢 Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
