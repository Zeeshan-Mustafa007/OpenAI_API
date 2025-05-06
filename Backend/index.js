const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PassThrough } = require('stream');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Initialize OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middlewares
app.use(cors());
app.use(express.json());

// Use memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

// POST route to handle form submission
app.post('/upload', upload.fields([ { name: 'image' }, { name: 'file' } ]), async (req, res) => {
    const { text } = req.body;
    const image = req.files[ 'image' ] ? req.files[ 'image' ][ 0 ] : null;
    const file = req.files[ 'file' ] ? req.files[ 'file' ][ 0 ] : null;

    // Text-Only
    if (text && !image && !file) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4.1',
                messages: [ { role: 'user', content: text } ],
            });

            return res.json({
                response: response.choices[ 0 ].message.content,
            });
        } catch (error) {
            console.error('OpenAI error:', error);
            return res.status(500).json({ error: 'Something went wrong with OpenAI.' });
        }
    }
    // Image-Text
    else if (image && !file) {
        try {
            const base64Image = image.buffer.toString('base64');
            const mimeType = image.mimetype || 'image/jpeg'; // fallback if not present

            const response = await openai.responses.create({
                model: 'gpt-4.1', // updated to use vision-capable model
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

            // console.log('OpenAI response:', response.output_text);

            return res.json({
                response: response.output_text,
            });
        } catch (error) {
            console.error('OpenAI error:', error);
            return res.status(500).json({ error: 'Something went wrong with OpenAI.' });
        }
    }
    // File-Text
    else if (!image && file) {
        try {
            // Limit check (e.g., 20MB)
            const MAX_FILE_SIZE = 20 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                return res.status(400).json({
                    error: `File too large. Max allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
                });
            }

            // Convert buffer to base64 string
            const base64String = file.buffer.toString('base64');
            const mimeType = file.mimetype || 'application/octet-stream';

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

            console.log("OpenAI file-text response:", response);

            return res.json({
                response: response.output_text,
            });
        } catch (error) {
            console.error("OpenAI file or chat error:", error);
            return res.status(500).json({ error: "Something went wrong with OpenAI." });
        }
    }



    return res.status(400).json({ error: 'No valid input provided.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
