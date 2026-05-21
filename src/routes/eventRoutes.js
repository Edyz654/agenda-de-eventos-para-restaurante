const express = require('express');
// Importa o framework Express

const EventController = require('../controllers/eventController');
// Importa o controller responsável por gerenciar as ações de eventos

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os eventos
router.get('/', EventController.getAll);

// Define a rota para buscar eventos pelo nome
router.get('/search', EventController.getByName);

// Define a rota para criar um novo evento
router.post('/', EventController.create);

// Define a rota para atualizar um evento existente pelo ID
router.put('/:id', EventController.update);

// Define a rota para deletar um evento pelo ID
router.delete('/:id', EventController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal