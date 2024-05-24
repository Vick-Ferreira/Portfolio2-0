const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoUploadController = require('../controller/videoUploadController');

// Configuração para upload de vídeos
const videoStorage = multer.memoryStorage();
const videoUpload = multer({ storage: videoStorage });

router.post('/upload/video', videoUpload.single('video'), videoUploadController.uploadVideo);

router.get('/videos', videoUploadController.listarVideos);

router.get('/videos/index/:index', videoUploadController.downloadVideo);

module.exports = router;
