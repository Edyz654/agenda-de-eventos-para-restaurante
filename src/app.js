const express = require('express');
// Importa o framework Express, utilizado para criar o servidor HTTP e gerenciar rotas

const cors = require('cors');
// Importa o middleware que permite o compartilhamento de recursos entre diferentes origens(Cross - Origin Resource Sharing)

const swaggerUi = require('swagger-ui-express');
// Importa o Swagger UI para documentar e testar a API

const swaggerDocument = require('./docs/swagger');
// Importa a especificacao OpenAPI da API

const authRoutes = require('./routes/authRoutes');
// Importa as rotas relacionadas à autenticação (login, registro, etc.)

const helmet = require('helmet');
// Importa o middleware de segurança que adiciona cabeçalhos HTTP para proteger contra ataques comuns

const userRoutes = require('./routes/userRoutes');
// Importa as rotas relacionadas aos usuários

const customerRoutes = require('./routes/customerRoutes');
// Importa as rotas relacionadas aos clientes

const eventRoutes = require('./routes/eventRoutes');
// Importa as rotas relacionadas aos eventos

const spaceRoutes = require('./routes/spaceRoutes');
// Importa as rotas relacionadas aos espaços

const errorMiddleware = require('./middlewares/errorMiddleware');
// Importa o middleware para tratamento centralizado de erros

const authMiddleware = require('./middlewares/authMiddleware');
// Importa os middlewares de autenticação e autorização para proteger rotas específicas

const app = express();
// Cria uma instância do aplicativo Express

// Middlewares globais
app.use(cors());
// Habilita o CORS em todas as rotas da aplicação

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Disponibiliza a interface do Swagger UI para testar a API

app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
});
// Disponibiliza a especificacao OpenAPI em JSON

app.use(helmet());
// Adiciona proteção automática contra vulnerabilidades HTTP

app.use(express.json());
// Permite que o servidor interprete requisições com corpo em formato JSON

app.use('/auth', authRoutes);
// Define que todas as requisições iniciadas com /auth serão encaminhadas para o arquivo authRoutes

// Rotas da aplicação
app.use('/users', userRoutes);
// Define que todas as requisições iniciadas com /users serão encaminhadas para o arquivo userRoutes

app.use('/customers', customerRoutes);
// Define que todas as requisições iniciadas com /customers serão encaminhadas para o arquivo customerRoutes

app.use('/events', eventRoutes);
// Define que todas as requisições iniciadas com /events serão encaminhadas para o arquivo eventRoutes

app.use('/spaces', spaceRoutes);
// Define que todas as requisições iniciadas com /spaces serão encaminhadas para o arquivo spaceRoutes

// Middleware de tratamento de erros (deve ser adicionado depois das rotas)
app.use(errorMiddleware);
// Middleware que captura e trata erros, enviando respostas ao cliente

module.exports = app;
// Exporta a aplicação configurada para ser utilizada pelo servidor (server.js)
