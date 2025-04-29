const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
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
            instructions: "You are a helpful assistant.",
            model: "gpt-4-turbo",
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
        let prompt = text;
        if (image) prompt += ` (User uploaded image: ${image.originalname})`;
        if (file) prompt += ` (User uploaded file: ${file.originalname})`;

        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "user",
            content: prompt,
        });

        const run = await openai.beta.threads.runs.create(THREAD_ID, {
            assistant_id: ASSISTANT_ID,
        });

        // Wait until run completes
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

        const messages = await openai.beta.threads.messages.list(THREAD_ID);
        const latest = messages.data.find(m => m.role === "assistant");

        res.json({ response: latest?.content?.[ 0 ]?.text?.value || "No response." });

    } catch (err) {
        console.error("Error handling chat:", err);
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
