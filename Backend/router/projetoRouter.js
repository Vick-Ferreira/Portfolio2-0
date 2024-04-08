const router = require('express').Router()
const Projeto = require('../models/projetos')
const projetosController = require('../controller/projetoController')

const upload = require("../config/multer")

//crinado rotas para a API

router.post('/', upload.single('video'), projetosController.createProjeto);

router.get('/', (req, res) => {
    console.log("Recebida requisição GET para /projeto");
    // Chame a função buscarProjeto do controller
    projetosController.buscarProjeto(req, res);
});

module.exports = router;