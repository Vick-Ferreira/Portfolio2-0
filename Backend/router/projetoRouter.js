const router = require('express').Router()
const Projeto = require('../models/projetos')
const projetosController = require('../controller/projetoController')
const uploads = require("../config/multer");

//crinado rotas para a API
router.post('/', uploads.single('video'), projetosController.createProjeto);

router.get('/', projetosController.buscarProjeto);

module.exports = router;