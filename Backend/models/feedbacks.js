const mongoose = require('mongoose');

const Feedback = mongoose.model('Feedback', {
    nome: String,
    opiniao: String,
});

module.exports = Feedback;
