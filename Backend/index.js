//chamar express, mongoDB
const express = require('express')
const app = express() // precisa do ()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const path = require('path')
// Definição da porta do servidor
const port = process.env.PORT || 3000;



// Configuração do middleware express.json()
//Isso é importante para garantir que o corpo da solicitação seja analisado corretamente antes de ser passado para suas funções de rota.
app.use(express.json());

// Habilitar o CORS para todas as solicitações
app.use(cors());

// Importando os modelos e controladores
const projetoRouter = require('./router/projetoRouter');
app.use('/projeto', projetoRouter)



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