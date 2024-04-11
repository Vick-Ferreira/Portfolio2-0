const mongoose = require('mongoose');

const ImgBtn = mongoose.model('ImgBtn', {
    imagem: String,
});

module.exports = ImgBtn;