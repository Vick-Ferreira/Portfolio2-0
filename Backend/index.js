const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const path = require('path')
const port = process.env.PORT || 3000;



// Configurar o middleware para servir arquivos estáticos do diretório 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/imagens', express.static(path.join(__dirname, 'uploads/imagens')));


app.use(express.json());
app.use(cors());

const projetoRouter = require('./router/projetoRouter');
app.use('/projeto', projetoRouter);


const feedbackRouter = require('./router/feedbackRouter');
app.use('/feedback', feedbackRouter);

const imgBtnRouter = require('./router/imgBtnRouter');
app.use('/imgBtn', imgBtnRouter);


//configuração para servir meus arquivos estáticos
const frontendPath = path.join(__dirname,'../Frontend');
app.use(express.static(frontendPath));
app.use(express.urlencoded({extended:true}))//analisa dados das solicitações (extended :indica ao Express para analisar dados codificados em URL usando a biblioteca querystring do Node.js)


//metodo teste
app.get('/', (req, res) => {
  res.json({ message: 'Olá Vitoria, seu backend está rodando!' });
});
// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("Conexão com MongoDB estabelecida com sucesso!");
});

// Restante do seu código, como definição de rotas, configuração do servidor, etc.
// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor está rodando na porta: ${port}`);
});