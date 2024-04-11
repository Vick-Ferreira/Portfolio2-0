const router = require('express').Router()
const ImgBtn = require('../models/imgBtn')
const imgBtnController = require('../controller/imgBtnController')
const uploads = require("../config/multerImage");

router.post('/', uploads.single('imagem'), imgBtnController.createImgBtn);

router.get('/', imgBtnController.buscarImgBtn);

module.exports = router;
