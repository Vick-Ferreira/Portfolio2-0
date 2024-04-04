const mongoose = require('mongoose');

const Projeto = mongoose.model('Projeto', {
    titulo: String,
    descricao: String,
    src: String
});

module.exports = Projeto