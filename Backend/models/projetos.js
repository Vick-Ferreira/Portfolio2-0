const mongoose = require('mongoose');

const Projeto = mongoose.model('Projeto', {
    titulo: String,
    descricao: String,
    video: String,


});

module.exports = Projeto;