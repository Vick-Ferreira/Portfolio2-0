const mongoose = require('mongoose');

const Fad = mongoose.model('Fad', {
    nome: String,
    descricao: String,
   
});

module.exports = Fad;