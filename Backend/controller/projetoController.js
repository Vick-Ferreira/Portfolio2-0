const fs = require("fs");
const Projeto = require("../models/projetos");

exports.createProjeto = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const file = req.file;


    // Usando o método create do modelo do Projeto para criar um novo documento no MongoDB
    const projeto = await Projeto.create({
      titulo,
      descricao,
      src: file.path,
    });

    res.json({ projeto, msg: "Projeto salvo com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar o projeto." });
  }
};

exports.buscarProjeto = async (req, res) => {
    try{
        const projeto = await Projeto.find()
        res.status(200).json(projeto)
    }catch(error){
        res.status(500).json({json: error})
    }
}