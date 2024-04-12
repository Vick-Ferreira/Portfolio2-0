const Feedback = require('../models/feedbacks');

exports.createFeedback = async (req, res) => {
  try {
    const { nome, opiniao } = req.body;
    console.log("Dados recebidos ", nome, opiniao);
    const feedback = await Feedback.create({
      nome,
      opiniao
    });
    console.log("Feedback criado com sucesso:", feedback);
    res.json({ feedback, msg: "Feedback salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o feedback:", err);
    res.status(500).json({ message: "Erro ao salvar o feedback." });
  }
};