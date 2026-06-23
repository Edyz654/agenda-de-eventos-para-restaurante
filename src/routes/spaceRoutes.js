const express = require('express');
// Importa o framework Express

const SpaceController = require('../controllers/spaceController');
// Importa o controller responsável por gerenciar as ações de espaços

const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
// Importa os middlewares de autenticação e autorização

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os espaços
router.get('/', SpaceController.getAll);
// Define a rota para buscar um espaço pelo ID
router.get('/id/:id', SpaceController.getByID);
// Define a rota para buscar um espaço pelo nome
router.get('/name/:name', SpaceController.getByName);
// Define a rota para criar um espaço (somente admin)
router.post('/', authenticateToken, authorizeRole('admin'), SpaceController.create);
// Define a rota para atualizar um espaço pelo ID
router.put('/:id', authenticateToken, authorizeRole('admin'), SpaceController.update);


module.exports = router;
// Exporta o roteador configurado para ser usado no app principal
