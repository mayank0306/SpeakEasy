const axios = require('axios');

const apiKey = process.env.ASSEMBLYAI_API_KEY?.trim();
if (!apiKey) {
    console.error('ASSEMBLYAI_API_KEY is not set or empty');
    process.exit(1);
}

const assemblyai = axios.create({
    baseURL: 'https://api.assemblyai.com/v2',
    headers: {
        authorization: apiKey,
    },
});

async function uploadAudio(fileBuffer) {
    const res = await assemblyai.post('/upload', fileBuffer, {
        headers: { 'content-type': 'application/octet-stream' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    });
    return res.data.upload_url;
}

async function createTranscript(audioUrl) {
    const res = await assemblyai.post('/transcript', { audio_url: audioUrl }, {
        headers: { 'content-type': 'application/json' },
    });
    return res.data; // contains id
}

async function getTranscript(transcriptId) {
    const res = await assemblyai.get(`/transcript/${transcriptId}`);
    return res.data;
}

module.exports = {
    assemblyai,
    uploadAudio,
    createTranscript,
    getTranscript,
};


