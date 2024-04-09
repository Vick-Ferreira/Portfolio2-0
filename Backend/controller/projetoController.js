const Projeto = require('../models/projetos');


exports.createProjeto = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const video = req.file.path; // Caminho do arquivo de vídeo

    console.log("Dados recebidos para criação do projeto:", titulo, descricao, video);

    // Crie o projeto diretamente no MongoDB com o caminho do vídeo
    const projeto = await Projeto.create({
      titulo,
      descricao,
      video
    });

    console.log("Projeto criado com sucesso:", projeto);
    
    res.json({ projeto, msg: "Projeto salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o projeto:", err);
    res.status(500).json({ message: "Erro ao salvar o projeto." });
  }
};

exports.buscarProjeto = async (req, res) => {
  try {
    const projetos = await Projeto.find();
    res.json(projetos);
  } catch (err) {
    console.error("Erro ao buscar projetos:", err);
    res.status(500).json({ message: "Erro ao buscar projetos." });
  }
};

