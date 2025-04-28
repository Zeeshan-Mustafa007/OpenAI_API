const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
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

const upload = multer();

// POST route to handle form submission
app.post('/upload', upload.fields([ { name: 'image' }, { name: 'file' } ]), async (req, res) => {
    const { text } = req.body;
    const image = req.files[ 'image' ] ? req.files[ 'image' ][ 0 ] : null;
    const file = req.files[ 'file' ] ? req.files[ 'file' ][ 0 ] : null;

    console.log('Received Text:', text);
    console.log('Received Image:', image);
    console.log('Received File:', file);

    // Open-AI API Calls

    // Text-Only
    if (text && !image && !file) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4.1',
                messages: [ { role: 'user', content: text } ],
            });

            res.json({
                response: response.choices[ 0 ].message.content,
            });
        } catch (error) {
            console.error('OpenAI error:', error);
            res.status(500).json({ error: 'Something went wrong with OpenAI.' });
        }
    }
    // Image-Text
    else if (text && image && !file) {
        try {
            const prompt = `Given this text: "${text}" and based on the uploaded image (${image.originalname}), generate a relevant response.`;

            const response = await openai.chat.completions.create({
                model: 'gpt-4.1',
                messages: [ { role: 'user', content: prompt } ],
            });

            res.json({
                response: response.choices[ 0 ].message.content,
            });
        } catch (error) {
            console.error('OpenAI error:', error);
            res.status(500).json({ error: 'Something went wrong with OpenAI.' });
        }
    }
    // File-Text
    else if (text && !image && file) {
        try {
            const prompt = `Given this text: "${text}" and considering the uploaded file (${file.originalname}), generate an appropriate response.`;

            const response = await openai.chat.completions.create({
                model: 'gpt-4.1',
                messages: [ { role: 'user', content: prompt } ],
            });

            res.json({
                response: response.choices[ 0 ].message.content,
            });
        } catch (error) {
            console.error('OpenAI error:', error);
            res.status(500).json({ error: 'Something went wrong with OpenAI.' });
        }
    }



    // Return the response. 
    res.json({
        message: 'Upload successful!',
        data: {
            text,
            image: image ? image.filename : null,
            file: file ? file.filename : null,
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
