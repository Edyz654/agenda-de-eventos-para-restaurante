const EventModel = require("../models/eventModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela events)


class EventService {
    // Busca todos os eventos cadastrados
    static async getAllEvents() {
        return await EventModel.getAllEvents();
    }

    // Busca eventos pelo nome
    static async getEventsByName(event_name) {
        if (!event_name) {
            throw new Error("O nome do evento é obrigatório para busca."); // Valida se o nome do evento foi fornecido
        }

        return await EventModel.findByName(event_name);
    }

    // Cria um novo evento após validações
    static async createEvent(event) {
        const { user_id, space_id, customer_id, event_name, event_date } = event;

        if (!user_id) {
            throw new Error("O ID do usuário é obrigatório."); // Valida se o ID do usuário foi fornecido
        }

        if (!space_id) {
            throw new Error("O ID do espaço é obrigatório."); // Valida se o ID do espaço foi fornecido
        }

        if (!customer_id) {
            throw new Error("O ID do cliente é obrigatório."); // Valida se o ID do cliente foi fornecido
        }

        if (!event_name) {
            throw new Error("O nome do evento é obrigatório."); // Valida se o nome do event foi fornecido
        }

        if (!event_date) {
            throw new Error("A data do evento é obrigatória."); // Valida se a data do evento foi fornecida
        }

        return await EventModel.create(event); // Cria o novo evento
    }

    // Atualiza informações de um evento existente
    static async updateEvent(id, event) {
        const updatedRows = await EventModel.update(id, event);
        if (updatedRows === 0) {
            throw new Error("Evento não encontrado."); // Caso nenhum evento tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um evento pelo ID
    static async deleteEvent(id) {
        const deletedRows = await EventModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Evento não encontrado."); // Caso nenhum evento tenha sido deletado
        }
        return deletedRows;
    }
}

module.exports = EventService;
// Exporta a classe para ser utilizada pelos controllers