const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI, toFile } = require('openai');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 5000;
const dotenvPath = path.resolve(__dirname, '.env');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

let ASSISTANT_ID = process.env.ASSISTANT_ID;
let THREAD_ID = process.env.THREAD_ID;

// ✅ Create Assistant if needed
async function ensureAssistant() {
    if (!ASSISTANT_ID) {
        const assistant = await openai.beta.assistants.create({
            name: "My Assistant",
            instructions: "You are a helpful assistant. You can analyze images and PDF documents. Answer user questions using any uploaded file knowledge.",
            model: "gpt-4o",
            tools: [ { type: 'file_search' } ],
        });
        ASSISTANT_ID = assistant.id;
        updateEnvVar("ASSISTANT_ID", ASSISTANT_ID);
        console.log("✅ Assistant created:", ASSISTANT_ID);
    } else {
        console.log("✅ Using existing Assistant ID:", ASSISTANT_ID);
    }
}

// ✅ Create Thread if needed
async function ensureThread() {
    if (!THREAD_ID) {
        const thread = await openai.beta.threads.create();
        THREAD_ID = thread.id;
        updateEnvVar("THREAD_ID", THREAD_ID);
        console.log("✨ Thread created:", THREAD_ID);
    } else {
        console.log("✅ Using existing Thread ID:", THREAD_ID);
    }
}

// ✅ Save to .env
function updateEnvVar(key, value) {
    let env = fs.readFileSync(dotenvPath, "utf8");
    if (env.includes(`${key}=`)) {
        env = env.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
    } else {
        env += `\n${key}=${value}`;
    }
    fs.writeFileSync(dotenvPath, env, "utf8");
}

// 🔁 Initialize assistant + thread on server start
(async () => {
    await ensureAssistant();
    await ensureThread();
})();

// 📨 POST /upload

app.post('/upload', upload.fields([ { name: 'image' }, { name: 'file' } ]), async (req, res) => {
    const { text } = req.body;
    const image = req.files[ 'image' ]?.[ 0 ];
    const file = req.files[ 'file' ]?.[ 0 ];

    if (!text) return res.status(400).json({ error: "Text is required." });

    try {
        const messageContent = [ { type: "text", text } ];

        let imageFile, uploadedFile;

        // Upload image or file to OpenAI
        if (image) {
            imageFile = await openai.files.create({
                file: await toFile(image.buffer, image.originalname),
                purpose: 'assistants'
            });
            // console.log("Image file created:", imageFile.id);

        } else if (file) {
            uploadedFile = await openai.files.create({
                file: await toFile(file.buffer, file.originalname),
                purpose: 'assistants'
            });
            console.log("file created:", uploadedFile.id);
        }

        // Send message + Image to thread
        if (image && imageFile) {
            console.log("Sending message + image to thread:", imageFile.id);
            
            await openai.beta.threads.messages.create(THREAD_ID, {
                role: "user",
                content: [
                    { type: 'text', text },
                    {
                        type: 'image_file',
                        image_file: {
                            file_id: imageFile.id, // This comes from openai.files.create
                        }
                    }
                ],
            });
        }
        // Send message + File to thread
        else if (file && uploadedFile) {
            await openai.beta.threads.messages.create(THREAD_ID, {
                role: "user",
                content: messageContent,
                attachments: [
                    {
                        file_id: uploadedFile.id,
                        tools: [ { type: "file_search" } ],
                    },
                ], 
            });
        }
        // Send message to thread
        else {
            await openai.beta.threads.messages.create(THREAD_ID, {
                role: "user",
                content: messageContent,
            });
        }

        // Start a run
        const run = await openai.beta.threads.runs.create(THREAD_ID, {
            assistant_id: ASSISTANT_ID,
        });

        // Wait for run to complete
        const timeout = Date.now() + 60 * 1000;
        let status;
        while (Date.now() < timeout) {
            const check = await openai.beta.threads.runs.retrieve(THREAD_ID, run.id);
            status = check.status;
            if (status === "completed") break;
            await new Promise(r => setTimeout(r, 1000));
        }

        if (status !== "completed") {
            throw new Error("Run did not complete in time.");
        }

        // Get response from assistant
        const messages = await openai.beta.threads.messages.list(THREAD_ID);
        const latest = messages.data.find(m => m.role === "assistant");

        res.json({ response: latest?.content?.[ 0 ]?.text?.value || "No response." });

    } catch (err) {
        console.error("Assistant error:", err);
        res.status(500).json({ error: "Something went wrong." });
    }
});


// 📜 GET /history - Returns full chat from OpenAI thread
app.get('/history', async (req, res) => {
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
