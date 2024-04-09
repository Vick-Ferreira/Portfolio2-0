const fs = require("fs");
const Projeto = require("../models/projetos");

exports.createProjeto = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const src = req.body.src; // Alteração aqui

    console.log("Dados recebidos para criação do projeto:", titulo, descricao, src);

    // Crie o projeto diretamente no MongoDB com a URL do vídeo
    const projeto = await Projeto.create({
      titulo,
      descricao,
      src
    });

    console.log("Projeto criado com sucesso:", projeto);
    
    res.json({ projeto, msg: "Projeto salvo com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar o projeto:", err);
    res.status(500).json({ message: "Erro ao salvar o projeto." });
  }
};  

//garantir rota /projeto sempre retorne uma matriz de projetos
// Função para buscar projetos
exports.buscarProjeto = async (req, res) => {
  try {
      console.log("Chamada da função buscarProjeto");
      const projetos = await Projeto.find();
      res.status(200).json(projetos);
  } catch(error) {
      console.error("Erro ao buscar projetos:", error);
      res.status(500).json({ error: error.message });
  }
};
