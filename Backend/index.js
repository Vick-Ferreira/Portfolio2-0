const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const { Readable } = require('stream');

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Configuração para servir arquivos estáticos
const frontendPath = path.join(__dirname, '../Frontend');
app.use(express.static(frontendPath));
app.use(express.urlencoded({ extended: true }));

// Conexão com o banco de dados MongoDB
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

const storage = multer.memoryStorage();
const upload = multer({ storage });
const video = multer({storage});

// Rota POST para lidar com o upload de arquivos

app.post('/upload', upload.single('imagem'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const bucket = new GridFSBucket(database, { bucketName: 'uploads' });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname);

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
});

//OBS:
//Rota GET para listar todos os arquivos
//Esta rota é essencial para fornecer ao front-end a informação necessária sobre quais arquivos estão disponíveis para serem exibidos.
//Retorna a lista de arquivos com seus metadados
//arquivos disponiveis
app.get('/files', async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const filesCollection = database.collection('uploads.files');

    const files = await filesCollection.find().toArray();
    res.status(200).json(files);
    client.close();
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    client.close();
  }
});

//OBS:
//Rota GET para baixar o arquivo pelo índice
//Fornece o conteúdo do arquivo (imagem) para renderização.
//Esta rota é responsável por fornecer o conteúdo binário do arquivo específico, permitindo que o front-end exiba a imagem.
//arquivo especifico para renderizar
app.get('/files/index/:index', async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Índice inválido' });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const filesCollection = database.collection('uploads.files');

    const files = await filesCollection.find().toArray();

    if (index < 0 || index >= files.length) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const file = files[index];
    const bucket = new GridFSBucket(database, { bucketName: 'uploads' });
    const downloadStream = bucket.openDownloadStream(file._id);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', (error) => {
      console.error('Erro ao baixar arquivo:', error);
      res.status(500).json({ error: 'Erro ao baixar arquivo' });
      client.close();
    });

    downloadStream.on('end', () => {
      res.end();
      client.close();
    });
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
    client.close();
  }
});





//VIDEO

app.post('/upload/video', video.single('video'), async (req, res) => {
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
});

// Rota GET para listar todos os vídeos com metadados
app.get('/videos', async (req, res) => {
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
});

// Rota GET para baixar o vídeo pelo índice
app.get('/videos/index/:index', async (req, res) => {
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
});




// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta: ${port}`);
});
