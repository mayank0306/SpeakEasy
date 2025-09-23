const fs = require('fs');
const {
    uploadAudio,
    createTranscript,
    getTranscript,
} = require('../services/assemblyaiService');

// POST /api/analyze
async function handleAnalysis(req, res) {
    console.log("=== Speech Analysis Request Started ===");
    console.log("Request received at:", new Date().toISOString());

    if (!req.file) {
        console.error("No file uploaded in request");
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    console.log("File uploaded:", req.file.originalname, "Size:", req.file.size, "bytes");

    try {
        console.log("Step 1: Uploading file to AssemblyAI...");
        const uploadUrl = await uploadAudio(fs.readFileSync(filePath));
        console.log("File uploaded successfully. URL:", uploadUrl);

        console.log("Step 2: Requesting transcription...");
        const transcriptResponse = await createTranscript(uploadUrl);
        const transcriptId = transcriptResponse.id;
        console.log("Transcription requested. ID:", transcriptId);

        // Polling for completion
        console.log("Step 3: Polling for transcription completion...");
        let transcriptData;
        let pollCount = 0;
        const maxPolls = 40; // ~80s
        while (pollCount < maxPolls) {
            transcriptData = await getTranscript(transcriptId);
            console.log(`Poll ${pollCount + 1}: Status = ${transcriptData.status}`);

            if (transcriptData.status === 'completed') {
                console.log("Transcription completed successfully!");
                break;
            } else if (transcriptData.status === 'error') {
                console.error("Transcription failed:", transcriptData.error);
                throw new Error(`Transcription failed: ${transcriptData.error}`);
            }

            pollCount++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (pollCount >= maxPolls) {
            throw new Error('Transcription timed out after 60 seconds');
        }

        // Analysis
        console.log("Step 4: Performing speech analysis...");
        const transcriptText = transcriptData.text || '';
        const audioDuration = transcriptData.audio_duration / 60; // minutes
        console.log(`Audio duration: ${audioDuration.toFixed(2)} minutes`);

        const words = transcriptText.split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        console.log(`Total words: ${wordCount}`);
        const wordsPerMinute = audioDuration > 0 ? Math.round(wordCount / audioDuration) : 0;
        console.log(`Words per minute: ${wordsPerMinute}`);

        const fillerWordsList = ['um', 'uh', 'like', 'so', 'you know', 'actually', 'basically', 'ahh','ummmm','uhhhh'];
        const fillerWordCount = fillerWordsList.reduce((count, filler) => {
            const regex = new RegExp(`\\b${filler}\\b`, 'gi');
            const matches = transcriptText.match(regex);
            return count + (matches ? matches.length : 0);
        }, 0);
        console.log(`Filler words found: ${fillerWordCount}`);

        // Suggestions
        let pacingSuggestion;
        if (wordsPerMinute > 160) {
            pacingSuggestion = "Your pace is quite fast. Try speaking a bit more slowly to ensure your audience can follow along.";
        } else if (wordsPerMinute < 130) {
            pacingSuggestion = "Your pace is a little slow. Try speaking a bit faster to keep your audience engaged.";
        } else {
            pacingSuggestion = "Your pacing is excellent! It's right in the ideal range for presentations.";
        }

        let longPauseCount = 0;
        const wordsWithTimestamps = Array.isArray(transcriptData.words) ? transcriptData.words : [];
        for (let i = 1; i < wordsWithTimestamps.length; i++) {
            const previousWord = wordsWithTimestamps[i - 1];
            const currentWord = wordsWithTimestamps[i];
            const prevEnd = typeof previousWord?.end === 'number' ? previousWord.end : null;
            const currStart = typeof currentWord?.start === 'number' ? currentWord.start : null;
            if (prevEnd !== null && currStart !== null) {
                let diff = currStart - prevEnd; // ms
                const pauseSeconds = diff > 100 ? diff / 1000 : diff;
                if (pauseSeconds > 2.0) {
                    longPauseCount++;
                }
            }
        }

        let pauseSuggestion;
        if (longPauseCount > 3) {
            pauseSuggestion = `You paused for over 2 seconds ${longPauseCount} times. Try to make your transitions between sentences smoother.`;
        } else if (fillerWordCount > 5) {
            pauseSuggestion = `You used ${fillerWordCount} filler words. Practice your speech to reduce reliance on words like 'um' and 'like'.`;
        } else {
            pauseSuggestion = "Great job on maintaining a smooth flow with minimal long pauses!";
        }

        console.log("Analysis complete! Sending results to client...");
        res.json({
            message: 'Analysis complete!',
            transcript: transcriptText,
            wordsPerMinute,
            fillerWordCount,
            suggestions: {
                pacing: pacingSuggestion,
                pauses: pauseSuggestion,
            },
        });
    } catch (error) {
        console.error('=== ERROR DURING ANALYSIS ===');
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        console.error('Stack trace:', error.stack);

        let errorMessage = 'An error occurred during analysis.';
        if (error.message.includes('Transcription failed')) {
            errorMessage = 'Speech transcription failed. Please try again.';
        } else if (error.message.includes('timed out')) {
            errorMessage = 'Analysis timed out. Please try with a shorter recording.';
        } else if (error.response?.status === 401) {
            errorMessage = 'API authentication failed. Please check server configuration.';
        }

        res.status(500).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        try {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
                console.log("Temporary file cleaned up successfully");
            }
        } catch (cleanupError) {
            console.error("Error cleaning up temporary file:", cleanupError.message);
        }
    }
}

// Placeholder for potential WebSocket support in future
function handleWebSocketConnection() {
    // Intentionally left minimal; add ws server hookup here if needed
}

module.exports = {
    handleAnalysis,
    handleWebSocketConnection,
};


