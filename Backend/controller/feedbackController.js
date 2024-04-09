const Feedback = require('../models/feedbacks');

exports.createFeedback = async (req, res) => {
  try {
    const { nome, opniao } = req.body;

    console.log("Dados recebidos ", nome, opniao);

    const feedback = await Feedback.create({
      nome,
      opniao
    });

    console.log("Feedback criado com sucesso:", feedback);
    
    res.json({ feedback, msg: "Feedback salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o feedback:", err);
    res.status(500).json({ message: "Erro ao salvar o feedback." });
  }
};