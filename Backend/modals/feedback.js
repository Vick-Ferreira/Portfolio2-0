const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    nome: String,
    opiniao: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
