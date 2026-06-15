const EventService = require('../services/eventService');
// Importa o serviço que contém a lógica de negócio para manipular eventos

class EventController {
    // Método para listar todos os eventos
    static async getAll(req, res) {
        try {
            const events = await EventService.getAllEvents(); // Chama o service para buscar eventos
            res.json(events); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(500).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    static async getByName(req, res) {
        try {
            const events = await EventService.getEventsByName(req.query.name); // Chama o service para buscar eventos pelo nome
            res.json(events); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro, retorna status 400
        }
    }

    // Método para criar um novo evento
    static async create(req, res) {
        try {
            const id = await EventService.createEvent(req.body); // Chama o service para criar evento
            res.status(201).json({ message: 'Evento criado com sucesso.', id }); // Retorna status 201(criado) e o ID
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro de validação, retorna status 400
        }
    }

    // Método para atualizar um evento existente
    static async update(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await EventService.updateEvent(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Evento atualizado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); // Retorna erro se não encontrar ou problema nos dados
        }
    }
    
    // Metodo para atualizar apenas o status do evento
    static async updateStatus(req, res) {
        try {
            const id = req.params.id;
            await EventService.updateEventStatus(id, req.body.event_status);
            res.json({ message: 'Status do evento atualizado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Método para deletar um evento pelo ID
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await EventService.deleteEvent(id); // Chama o service para deletar
            res.json({ message: 'Evento deletado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); // Retorna erro se evento não encontrado
        }
    }
}

module.exports = EventController;
// Exporta o Controller para ser usado nas rotas
