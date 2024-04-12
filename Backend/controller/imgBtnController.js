const ImgBtn = require('../models/imgBtn');

exports.createImgBtn = async (req, res) => {
  try {
    const imagem = req.file.path; // Caminho do arquivo de vídeo
    console.log("Dados recebidos para criação do projeto:", imagem);
    // Crie o projeto diretamente no MongoDB com o caminho do vídeo
    const imgBtn = await ImgBtn.create({
      imagem
    });
    console.log("Projeto criado com sucesso:", imgBtn);
    res.json({ imgBtn, msg: "Projeto salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o projeto:", err);
    res.status(500).json({ message: "Erro ao salvar o projeto." });
  }
};
exports.buscarImgBtn = async (req, res) => {
  try {
    const imgBtn = await ImgBtn.find();
    res.json(imgBtn);
  } catch (err) {
    console.error("Erro ao buscar projetos:", err);
    res.status(500).json({ message: "Erro ao buscar projetos." });
  }
};
