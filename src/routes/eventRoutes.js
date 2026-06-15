const express = require('express');
// Importa o framework Express

const EventController = require('../controllers/eventController');
// Importa o controller responsável por gerenciar as ações de eventos

const {authenticateToken, authorizeRole} = require('../middlewares/authMiddleware');
// Importa o middleware de autenticação para proteger as rotas de eventos

const router = express.Router();
// Cria uma nova instância de roteador do Express

router.get('/', authenticateToken, EventController.getAll);
router.get('/search', authenticateToken, EventController.getByName);

router.post('/', authenticateToken, authorizeRole('admin'), EventController.create);
router.put('/:id', authenticateToken, authorizeRole('admin'), EventController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), EventController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal