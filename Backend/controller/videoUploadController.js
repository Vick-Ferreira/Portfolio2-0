const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');


require('dotenv').config();

const dbName = process.env.DB_NAME;
const url = process.env.MONGODB_URI;

exports.uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const { titulo, descricao, link } = req.body;
  console.log('Corpo da requisição:', req.body);

  if (!link) {
    return res.status(400).json({ error: 'Campo link é obrigatório' });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const bucket = new GridFSBucket(database, { bucketName: 'videos' });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { titulo, descricao, link }
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

//GET LISTA POR INDEX
exports.downloadVideo = async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Índice inválido' });
  }

  let client;

  try {
    client = new MongoClient(url);

    console.log('Conectando ao banco de dados MongoDB...');
    await client.connect();
    console.log('Conexão ao MongoDB estabelecida');

    const database = client.db(dbName);
    const videosCollection = database.collection('videos.files');

    console.log('Buscando vídeos no banco de dados...');
    const videos = await videosCollection.find().toArray();
    console.log('Vídeos encontrados:', videos.length);

    if (index < 0 || index >= videos.length) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = videos[index];
    console.log('Detalhes do vídeo:', video);

    const bucket = new GridFSBucket(database, { bucketName: 'videos' });
    console.log('Abrindo download stream para o vídeo com ID:', video._id);

    const range = req.headers.range;
    if (!range) {
      return res.status(416).send('Requires Range header');
    }

    const videoSize = video.length;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const downloadStream = bucket.openDownloadStream(video._id, { start, end: end + 1 });

    downloadStream.on('error', (error) => {
      console.error('Erro durante o streaming do vídeo:', error);
      res.status(500).json({ error: 'Erro durante o streaming do vídeo', details: error.message });
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB', details: error.message });
    if (client) {
      client.close();
    }
  }
};



/*
streaming é o processo de transmitir dados, como áudio ou vídeo, pela internet de forma contínua, permitindo que o conteúdo seja reproduzido enquanto ainda está sendo transferido. Isso contrasta com 
o download tradicional, onde o conteúdo deve ser completamente baixado antes que a reprodução possa começar.*/


//o GridFS não suporta a atualização direta de arquivos. 
exports.updateVideo = async (req, res) => {
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
      await client.close();
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const videoId = videos[index]._id;
    const bucket = new GridFSBucket(database, { bucketName: 'videos' });

    // Excluir o vídeo anterior
    await videosCollection.deleteOne({ _id: videoId });
    const chunksCollection = database.collection('videos.chunks');
    await chunksCollection.deleteMany({ files_id: videoId });

    // Verificar se há um arquivo de vídeo na requisição
    if (!req.file) {
      await client.close();
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { titulo, descricao, link } = req.body;

    // Adicionar o novo vídeo
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { titulo, descricao, link }
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('error', async (error) => {
      console.error('Erro ao enviar arquivo:', error);
      await client.close();
      return res.status(500).json({ error: 'Erro ao enviar arquivo' });
    });

    uploadStream.on('finish', async () => {
      res.status(200).json({ message: 'Arquivo enviado com sucesso' });
      await client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    await client.close();
    return res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
  }
};


exports.deleteVideo = async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Índice inválido' });
  }

  const client = new MongoClient(url);

  try {
    await client.connect();
    const database = client.db(dbName);
    const videosCollection = database.collection('videos.files');
    const chunksCollection = database.collection('videos.chunks');

    const videos = await videosCollection.find().toArray();

    if (index < 0 || index >= videos.length) {
      await client.close();
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const videoId = videos[index]._id;

    // Excluir o vídeo e seus chunks associados
    await videosCollection.deleteOne({ _id: videoId });
    await chunksCollection.deleteMany({ files_id: videoId });

    await client.close();
    return res.status(200).json({ message: 'Vídeo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    await client.close();
    return res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
  }
};