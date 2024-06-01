
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');


const port = process.env.PORT || 8080;
 
app.use(express.json());
app.use(cors());
 

const feedbackRouter = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRouter);
const imagemRouter = require('./routes/imgUploadsRoutes');
app.use(imagemRouter);
const videoRouter = require('./routes/videoUploadsRoutes');
app.use(videoRouter);


// Configuração para servir arquivos estáticos
const frontendPath = path.join(__dirname, '../Frontend');
app.use(express.static(frontendPath));
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });


// Adiciona listeners para os eventos de conexão do Mongoose
mongoose.connection.on('connected', () => {
  console.log('Conexão com o MongoDB estabelecida');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Conexão com o MongoDB desconectada');
});

// Adiciona um listener para o evento SIGINT (Ctrl + C)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexão com o MongoDB encerrada devido ao término do aplicativo');
    process.exit(0);
  });
});


// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta: ${port}`);
});
