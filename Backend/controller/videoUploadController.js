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

/* Rota GET para baixar o vídeo pelo índice
exports.downloadVideo = async (req, res) => {
  const index = parseInt(req.params.index, 10);
  console.log('Índice do vídeo:', index);

  if (isNaN(index)) {
    console.log('Índice inválido');
    return res.status(400).json({ error: 'Índice inválido' });
  }

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    console.log('Conectando ao banco de dados MongoDB...');
    await client.connect();
    console.log('Conexão ao MongoDB estabelecida');
    
    const database = client.db(dbName);
    const videosCollection = database.collection('videos.files');

    console.log('Buscando vídeos no banco de dados...');
    const videos = await videosCollection.find().toArray();
    console.log('Vídeos encontrados:', videos.length);

    if (index < 0 || index >= videos.length) {
      console.log('Vídeo não encontrado');
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = videos[index];
    console.log('Detalhes do vídeo:', video);

    const bucket = new GridFSBucket(database, { bucketName: 'videos' });
    console.log('Abrindo download stream para o vídeo com ID:', video._id);

    const downloadStream = bucket.openDownloadStream(video._id);

    
    console.log('Iniciando download do vídeo...');
    res.set('Content-Type', 'video/mp4');
    res.set('Accept-Ranges', 'bytes');
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Disposition', `inline; filename="${video.filename}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Erro ao baixar vídeo:', error);
      res.status(500).json({ error: 'Erro ao baixar vídeo', details: error.message });
      client.close();
    });

    downloadStream.on('end', () => {
      console.log('Download do vídeo completo.');
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB', details: error.message });
    client.close();
  }
};
*/

exports.downloadVideo = async (req, res) => {
  const index = parseInt(req.params.index, 10);
  console.log('Índice do vídeo:', index);

  if (isNaN(index)) {
    console.log('Índice inválido');
    return res.status(400).json({ error: 'Índice inválido' });
  }

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    console.log('Conectando ao banco de dados MongoDB...');
    await client.connect();
    console.log('Conexão ao MongoDB estabelecida');

    const database = client.db(dbName);
    const videosCollection = database.collection('videos.files');

    console.log('Buscando vídeos no banco de dados...');
    const videos = await videosCollection.find().toArray();
    console.log('Vídeos encontrados:', videos.length);

    if (index < 0 || index >= videos.length) {
      console.log('Vídeo não encontrado');
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = videos[index];
    console.log('Detalhes do vídeo:', video);

    const bucket = new GridFSBucket(database, { bucketName: 'videos' });
    console.log('Abrindo download stream para o vídeo com ID:', video._id);

    const range = req.headers.range;
    if (!range) {
      console.log('Sem cabeçalho de range. Servindo vídeo completo.');
      res.status(416).send('Requer cabeçalho de range');
      return;
    }

    const videoSize = video.length;
    const start = Number(range.replace(/\D/g, ''));
    const end = videoSize - 1;
    const contentLength = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'no-cache'
    };

    res.writeHead(206, headers);

    const downloadStream = bucket.openDownloadStream(video._id, {
      start,
      end: end + 1
    });

    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Erro ao baixar vídeo:', error);
      res.status(500).json({ error: 'Erro ao baixar vídeo', details: error.message });
      client.close();
    });

    downloadStream.on('end', () => {
      console.log('Download do vídeo completo.');
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB', details: error.message });
    client.close();
  }
};