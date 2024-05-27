const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
require('dotenv').config();

const dbName = process.env.DB_NAME;
const url = process.env.MONGODB_URI;

exports.uploadImage = async (req, res) => {
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
};


exports.listarFiles = async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const database = client.db(dbName);
    const filesCollection = database.collection('uploads.files');

    const files = await filesCollection.find().toArray();
    res.status(200).json(files);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    res.status(500).json({ error: 'Erro ao conectar ao MongoDB' });
  } finally {
    client.close(); // Fechar a conexão aqui
  }
};

exports.dowloadImage = async (req, res) => {
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
};

