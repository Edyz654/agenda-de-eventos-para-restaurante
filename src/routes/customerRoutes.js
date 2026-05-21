const express = require('express');
// Importa o framework Express

const CustomerController = require('../controllers/customerController');
// Importa o controller responsável por gerenciar as ações de clientes

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os clientes
router.get('/', CustomerController.getAll);

// Define a rota para buscar clientes pelo nome
router.get('/search', CustomerController.getByName);

// Define a rota para criar um novo cliente
router.post('/', CustomerController.create);

// Define a rota para atualizar um cliente existente pelo ID
router.put('/:id', CustomerController.update);

// Define a rota para deletar um cliente pelo ID
router.delete('/:id', CustomerController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal