const express = require('express');
const multer = require('multer');
const { handleAnalysis } = require('../controllers/analysisController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/analyze
router.post('/analyze', upload.single('audio'), handleAnalysis);

module.exports = router;


