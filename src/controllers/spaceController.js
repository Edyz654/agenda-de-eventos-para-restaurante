const SpaceService = require('../services/spaceService');
// Importa o serviço que contém a lógica de negócio para manipular espaços

class SpaceController {
    // Método para listar todos os espaços
    static async getAll(req, res) {
        try {
            const spaces = await SpaceService.getAllSpaces(); // Chama o service para buscar espaços
            res.json(spaces); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(500).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    static async getByID(req, res) {
        try {
            const spaces = await SpaceService.getSpaceById(req.params.id); // Chama o service para buscar espaços pelo ID
            res.json(spaces); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro, retorna status 400
        }
    }

    static async getByName(req, res) {
        try {
            const spaces = await SpaceService.getSpaceByName(req.params.name); // Chama o service para buscar espaços pelo nome
            res.json(spaces); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro, retorna status 400
        }
    }

    // Método para criar um novo espaço
    static async create(req, res) {
        try {
            const id = await SpaceService.createSpace(req.body);
            res.status(201).json({ message: 'Espaço criado com sucesso.', id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            await SpaceService.updateSpace(req.params.id, req.body);
            res.json({ message: 'Espaço atualizado com sucesso.' });
        }
        catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro, retorna status 400
        }
    }
}

module.exports = SpaceController;
// Exporta o Controller para ser usado nas rotas
