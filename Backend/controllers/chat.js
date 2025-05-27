const { OpenAI, toFile } = require("openai");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let THREAD_ID;

const configPath = path.resolve(__dirname, "config.json");

//  read from JSON file
function readConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}), "utf8"); // Create file if not present
    }
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
}

//  write to JSON file
function writeConfig(key, value) {
    const config = readConfig();
    config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

// Create Thread if needed
async function ensureThread() {
    const config = readConfig();
    THREAD_ID = config.THREAD_ID;

    if (!THREAD_ID) {
        const thread = await openai.beta.threads.create();
        THREAD_ID = thread.id;
        writeConfig("THREAD_ID", THREAD_ID);
        console.log("Thread created:", THREAD_ID);
    } else {
        console.log("Using existing Thread ID:", THREAD_ID);
    }
}

(async () => {
    await ensureThread();
})();

async function uploadText(text, webSearch) {
    let response;
    if (webSearch === "true") {
        // console.log("Web search enabled:", webSearch);
        response = await openai.responses.create({
            model: "gpt-4.1",
            tools: [{ type: "web_search_preview" }],
            input: text,
        });
    } else {
        // console.log("Web search disabled:", webSearch);
        response = await openai.responses.create({
            model: "gpt-4.1",
            input: text,
        });
    }

    // Sending user message to thread
    await openai.beta.threads.messages.create(THREAD_ID, {
        role: "user",
        content: [{ type: "text", text }],
    });

    // Sending assistant response to thread
    await openai.beta.threads.messages.create(THREAD_ID, {
        role: "assistant",
        content: [{ type: "text", text: response.output_text }],
    });

    return response.output_text;
}

async function uploadImage(text, image) {
    // Upload image to OpenAI
    const imageFile = await openai.files.create({
        file: await toFile(image.buffer, image.originalname),
        purpose: "user_data",
    });

    // Send message + Image to thread
    if (image && imageFile) {
        const base64Image = image.buffer.toString("base64");
        const mimeType = image.mimetype || "image/jpeg"; // fallback if not present

        const response = await openai.responses.create({
            model: "gpt-4.1",
            // tools: [{ type: "web_search_preview" }],
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: text.trim() || image?.originalname || "",
                        },
                        {
                            type: "input_image",
                            image_url: `data:${mimeType};base64,${base64Image}`,
                        },
                    ],
                },
            ],
        });

        // console.log("Sending message + image to thread:", imageFile.id);

        // Sending user message + image to thread
        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "user",
            content: [
                {
                    type: "text",
                    text: text.trim() || image?.originalname || "",
                },
                {
                    type: "image_file",
                    image_file: {
                        file_id: imageFile.id, // This comes from openai.files.create
                    },
                },
            ],
        });

        // console.log("Sending assistant response to thread.");

        // Sending assistant response to thread
        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "assistant",
            content: [{ type: "text", text: response.output_text }],
        });

        // console.log('OpenAI response:', response.output_text);
        return response.output_text;
    }
}

async function uploadFile(text, file) {
    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
        file: await toFile(file.buffer, file.originalname),
        purpose: "user_data",
    });

    console.log(uploadedFile);

    if (file && uploadedFile) {
        // Convert buffer to base64 string
        const base64String = file.buffer.toString("base64");
        const mimeType = file.mimetype || "application/octet-stream";


        const response = await openai.responses.create({
            model: "gpt-4.1",
            // tools: [{ type: "web_search_preview" }],
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
                            text: text.trim() || file?.originalname || "",
                        },
                    ],
                },
            ],
        });

        // sending user message + file to thread
        const msg = await openai.beta.threads.messages.create(THREAD_ID, {
            role: "user",
            content: [
                { type: "text", text: text.trim() || file?.originalname || "" },
            ],
        });
        
        // sending assistant response to thread
        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "assistant",
            content: [{ type: "text", text: response.output_text }],
        });

        // console.log("OpenAI file-text response:", response);
        return response.output_text;
    }
}

exports.upload = async (req, res) => {
    const { text, webSearch } = req.body;
    const image = req.files["image"]?.[0];
    const file = req.files["file"]?.[0];

    console.log("chat.js");
    console.log("Received text:", text);
    console.log("Received webSearch:", webSearch);
    console.log("Received image:", image);
    console.log("Received file:", file);

    try {
        // text + image
        if (image) {
            const response = await uploadImage(text, image);
            return res.json({
                response: response,
            });
        }
        // text + file
        else if (file) {
            const response = await uploadFile(text, file);
            return res.json({
                response: response,
            });
        }
        // text only
        else {
            const response = await uploadText(text, webSearch);
            return res.json({
                response: response,
            });
        }
    } catch (err) {
        // console.error("Assistant error:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
};

exports.fetchHistory = async (req, res) => {
    try {
        // Default limit is 20 messages change it to 100 if needed
        const messages = await openai.beta.threads.messages.list(THREAD_ID);
        res.json({ messages: messages.data.reverse() });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to retrieve chat history." });
    }
};

exports.newChat = async (req, res) => {
    try {
        const config = readConfig();
        THREAD_ID = config.THREAD_ID;

        if (THREAD_ID) {
            await openai.beta.threads.delete(THREAD_ID);
            writeConfig("THREAD_ID", null);
            console.log("Thread deleted:", THREAD_ID);
        }

        res.json({ message: "New chat started." });
    } catch (err) {
        console.error("Error starting new chat:", err);
        res.status(500).json({ error: "Failed to start a new chat." });
    }
};
