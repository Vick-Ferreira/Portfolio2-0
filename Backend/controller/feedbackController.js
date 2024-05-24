const Feedback = require('../modals/feedback');

exports.createFeedback = async (req, res) => {
    try {
        const { nome, opiniao } = req.body;
        const feedback = await Feedback.create({
            nome,
            opiniao
        });
        res.json({ feedback, msg: "Feedback salvo com sucesso" });
    } catch (err) {
        res.status(500).json({ msg: "Erro ao salvar feedback" });
    }
};