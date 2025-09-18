require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// AssemblyAI API Configuration
// We remove the global content-type header here
const assemblyai = axios.create({
    baseURL: 'https://api.assemblyai.com/v2',
    headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
    },
});

app.post('/api/analyze', upload.single('audio'), async (req, res) => {
    console.log("Running the LATEST version of the code!"); // <-- ADD THIS LINE

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;

    try {
        // Step 1: Upload the local file to AssemblyAI.
        // Axios will correctly set the content-type for a file stream.
        const uploadResponse = await assemblyai.post('/upload', fs.readFileSync(filePath));
        const uploadUrl = uploadResponse.data.upload_url;

        // Step 2: Request the transcription, explicitly setting the content-type to JSON.
        const transcriptResponse = await assemblyai.post('/transcript', {
            audio_url: uploadUrl,
            word_details: true,
        }, { headers: { 'content-type': 'application/json' } });
        const transcriptId = transcriptResponse.data.id;

        // Step 3: Poll for the transcription to complete
        let transcriptData;
        while (true) {
            const pollResponse = await assemblyai.get(`/transcript/${transcriptId}`);
            transcriptData = pollResponse.data;
            if (transcriptData.status === 'completed') {
                break;
            } else if (transcriptData.status === 'error') {
                throw new Error(`Transcription failed: ${transcriptData.error}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // Step 4: Perform our custom analysis
        const words = transcriptData.words || [];
        const audioDuration = transcriptData.audio_duration / 60; // in minutes

        // Pacing analysis
        const wordCount = words.length;
        // Safety check to prevent division by zero for very short audio
        const wordsPerMinute = audioDuration > 0 ? Math.round(wordCount / audioDuration) : 0;

        // Filler word analysis
        const fillerWordsList = ['um', 'uh', 'like', 'so', 'you know', 'actually', 'basically', 'ahh','ummmm','uhhhh'];
        const fillerWordCount = words.filter(word => fillerWordsList.includes(word.text.toLowerCase())).length;

        // Send the final analysis back to the client
        res.json({
            message: 'Analysis complete!',
            transcript: transcriptData.text,
            wordsPerMinute,
            fillerWordCount,
        });

    } catch (error) {
        console.error('Error during analysis:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred during analysis.' });
    } finally {
        // Step 5: Clean up by deleting the temporary file
        fs.unlinkSync(filePath);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


