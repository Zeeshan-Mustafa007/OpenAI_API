const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');


router.post('/upload', chatController.upload);
router.get('/history', chatController.fetchHistory);

module.exports = router;