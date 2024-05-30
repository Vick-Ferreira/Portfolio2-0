const express = require('express');
const router = express.Router();
const multer = require('multer');
const imgUploadController = require('../controller/imgUploadController');


// Configuração para upload de imagens
const imgStorage = multer.memoryStorage();
const imgUpload = multer({ storage: imgStorage });

// Rota POST para lidar com o upload de arquivos(imagem)
router.post('/upload', imgUpload.single('imagem'), imgUploadController.uploadImage);


//OBS:
//Rota GET para listar todos os arquivos
//Esta rota é essencial para fornecer ao front-end a informação necessária sobre quais arquivos estão disponíveis para serem exibidos.
//Retorna a lista de arquivos com seus metadados
//arquivos disponiveis
router.get('/files', imgUploadController.listarFiles);

//OBS:
//Rota GET para baixar o arquivo pelo índice
//Fornece o conteúdo do arquivo (imagem) para renderização.
//Esta rota é responsável por fornecer o conteúdo binário do arquivo específico, permitindo que o front-end exiba a imagem.
//arquivo especifico para renderizar
router.get('/files/index/:index', imgUploadController.dowloadImage);

router.put('/files/index/:index', imgUpload.single('file'), imgUploadController.updateImage);

router.delete('/files/index/:index', imgUploadController.deleteImage);

module.exports = router;