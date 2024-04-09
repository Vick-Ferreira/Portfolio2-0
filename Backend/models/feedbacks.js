
const mongoose = require('mongoose');

const Feedback = mongoose.model('Feedback', {
    nome: String,
    opniao: String,
});

module.exports = Feedback;
