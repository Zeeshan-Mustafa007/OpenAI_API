const { OpenAI, toFile } = require('openai');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


let THREAD_ID;

const configPath = path.resolve(__dirname, 'config.json');

// ✅ Helper function to read from JSON file
function readConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}), 'utf8'); // Create file if not present
    }
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
}

// ✅ Helper function to write to JSON file
function writeConfig(key, value) {
    const config = readConfig();
    config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
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

async function fetchHistory() {
    const messages = await openai.beta.threads.messages.list(THREAD_ID);
    return messages.data.reverse();
}

 async function uploadText(text) { 
    const response = await openai.responses.create({
        model: 'gpt-4.1',
        tools: [ { type: "web_search_preview" } ],
        input: text,
    });

    // Sending user message to thread
    await openai.beta.threads.messages.create(THREAD_ID, {
        role: "user",
        content: [ { type: "text", text } ],
    });

    // Sending assistant response to thread
    await openai.beta.threads.messages.create(THREAD_ID, {
        role: "assistant",
        content: [
            { type: 'text', text: response.output_text },
        ],
    });

    return response.output_text;
}

 async function uploadImage(text, image) {
    // Upload image to OpenAI
    const imageFile = await openai.files.create({
        file: await toFile(image.buffer, image.originalname),
        purpose: 'user_data'
    });


    // Send message + Image to thread
    if (image && imageFile) {
        const base64Image = image.buffer.toString('base64');
        const mimeType = image.mimetype || 'image/jpeg'; // fallback if not present

        const response = await openai.responses.create({
            model: 'gpt-4.1',
            tools: [ { type: "web_search_preview" } ],
            input: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_text', text: text },
                        {
                            type: 'input_image',
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
                { type: 'text', text },
                {
                    type: 'image_file',
                    image_file: {
                        file_id: imageFile.id, // This comes from openai.files.create
                    }
                }
            ],
        });

        // Sending assistant response to thread
        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "assistant",
            content: [
                { type: 'text', text: response.output_text },
            ],
        });

        // console.log('OpenAI response:', response.output_text);
        return response.output_text;
    }
}

 async function uploadFile(text, file) {
    // Upload file to OpenAI
    const uploadedFile = await openai.files.create({
        file: await toFile(file.buffer, file.originalname),
        purpose: 'user_data'
    });

    if (file && uploadedFile) {

        // Convert buffer to base64 string
        const base64String = file.buffer.toString('base64');
        const mimeType = file.mimetype || 'application/octet-stream';

        const response = await openai.responses.create({
            model: "gpt-4.1",
            tools: [ { type: "web_search_preview" } ],
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
            content: [ { type: "text", text } ],
            attachments: [
                {
                    file_id: uploadedFile.id,
                    tools: [ { type: "file_search" } ],
                },
            ],
        });

        // sending assistant response to thread
        await openai.beta.threads.messages.create(THREAD_ID, {
            role: "assistant",
            content: [
                { type: 'text', text: response.output_text },
            ],
        });

        // console.log("OpenAI file-text response:", response);
        return response.output_text;
    }
}

module.exports = {    
    ensureThread,
    fetchHistory,
    uploadText,
    uploadImage,
    uploadFile,
};