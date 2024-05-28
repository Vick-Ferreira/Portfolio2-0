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
exports.listarVideos = async (req, res) => {
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

exports.downloadVideo = async (req, res) => {
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

    const range = req.headers.range;
    if (!range) {
      console.log('Requisição sem range');
      res.status(416).send('Range Not Satisfiable');
      return;
    }

    const videoSize = video.length;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

    if (start >= videoSize || end >= videoSize) {
      console.log('Range fora dos limites');
      res.status(416).send('Range Not Satisfiable');
      return;
    }

    console.log(`Servindo range: ${start}-${end}/${videoSize}`);

    const contentLength = (end - start) + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-cache, no-store, must-revalidate', // Desativa cache
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    res.writeHead(206, headers);

    const downloadStream = bucket.openDownloadStream(video._id, {
      start,
      end,
    });

    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Erro ao baixar vídeo:', error);
      res.status(500).json({ error: 'Erro ao baixar vídeo' });
      client.close();
    });

    downloadStream.on('end', () => {
      console.log('Download do vídeo completo.');
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    client.close();
  }
};