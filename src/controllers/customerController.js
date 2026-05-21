const CustomerService = require('../services/customerService');
// Importa o serviço que contém a lógica de negócio para manipular clientes

class CustomerController {
    // Método para listar todos os clientes
    static async getAll(req, res) {
        try {
            const customers = await CustomerService.getAllCustomers(); // Chama o service para buscar clientes
            res.json(customers); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(500).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    static async getByName(req, res) {
        try {
            const customers = await CustomerService.getCustomersByName(req.query.name); // Chama o service para buscar clientes pelo nome
            res.json(customers); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro, retorna status 400
        }
    }

    // Método para criar um novo cliente
    static async create(req, res) {
        try {
            const id = await CustomerService.createCustomer(req.body); // Chama o service para criar cliente
            res.status(201).json({ message: 'Cliente criado com sucesso.', id }); // Retorna status 201(criado) e o ID
        } catch (error) {
            res.status(400).json({ error: error.message }); // Em caso de erro de validação, retorna status 400
        }
    }

    // Método para atualizar um cliente existente
    static async update(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await CustomerService.updateCustomer(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Cliente atualizado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); // Retorna erro se não encontrar ou problema nos dados
        }
    }
    
    // Método para deletar um cliente pelo ID
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await CustomerService.deleteCustomer(id); // Chama o service para deletar
            res.json({ message: 'Cliente deletado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); // Retorna erro se cliente não encontrado
        }
    }
}

module.exports = CustomerController;
// Exporta o Controller para ser usado nas rotas
