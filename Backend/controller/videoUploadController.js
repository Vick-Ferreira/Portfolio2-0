const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const url = process.env.MONGODB_URI;

exports.uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const { titulo, descricao } = req.body;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const bucket = new GridFSBucket(database, { bucketName: 'videos' });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { titulo, descricao }
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Erro ao enviar arquivo:', error);
      res.status(500).json({ error: 'Erro ao enviar arquivo' });
      client.close();
    });

    uploadStream.on('finish', () => {
      res.status(200).json({ message: 'Arquivo enviado com sucesso' });
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    client.close();
  }
};

// Rota GET para listar todos os vídeos com metadados
exports.listarVideos =  async (req, res) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const database = client.db(dbName);
        const videosCollection = database.collection('videos.files');

        const videos = await videosCollection.find().toArray();
        res.status(200).json(videos);
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    } finally {
        client.close();
    }
};

// Rota GET para baixar o vídeo pelo índice
exports.downloadVideo =  async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Índice inválido' });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const videosCollection = database.collection('videos.files');

    const videos = await videosCollection.find().toArray();

    if (index < 0 || index >= videos.length) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = videos[index];
    const bucket = new GridFSBucket(database, { bucketName: 'videos' });
    const downloadStream = bucket.openDownloadStream(video._id);

    res.set('Content-Type', 'video/mp4'); // ou o tipo MIME correto para o seu vídeo
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Erro ao baixar vídeo:', error);
      res.status(500).json({ error: 'Erro ao baixar vídeo' });
      client.close();
    });

    downloadStream.on('end', () => {
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    client.close();
  }
};



