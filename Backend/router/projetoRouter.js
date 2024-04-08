const express = require('express');
const router = express.Router();
const projetosController = require('../controller/projetoController');
const upload = require("../config/multer");

// Rota para criar um novo projeto
router.post('/', upload.single('video'), projetosController.createProjeto);

// Rota para buscar todos os projetos
router.get('/', projetosController.buscarProjeto);

module.exports = router;
