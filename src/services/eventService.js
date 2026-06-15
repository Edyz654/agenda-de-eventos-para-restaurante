const EventModel = require("../models/eventModel");
const UserModel = require("../models/userModel");
const CustomerModel = require("../models/customerModel");
const SpaceModel = require("../models/spaceModel");
// Importa os Models responsaveis pelo acesso ao banco de dados

const ALLOWED_SETUP_TYPES = ['buffet', 'coquetel', 'a_la_carte', 'reuniao', 'auditorio', 'pendente'];
const ALLOWED_EVENT_STATUSES = ['confirmado', 'nao_confirmado'];

class EventService {
    // Busca todos os eventos cadastrados
    static async getAllEvents() {
        return await EventModel.getAllEvents();
    }

    // Busca eventos pelo nome
    static async getEventsByName(event_name) {
        if (!event_name) {
            throw new Error("O nome do evento e obrigatorio para busca.");
        }

        return await EventModel.findByName(event_name);
    }

    static validateEventDate(event_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(event_date)) {
            throw new Error("A data do evento deve estar no formato YYYY-MM-DD.");
        }
    }

    static validateEventStart(event_start) {
        const eventStartDate = new Date(event_start);
        if (Number.isNaN(eventStartDate.getTime())) {
            throw new Error("O inicio do evento deve conter uma data e hora validas.");
        }
    }

    static validateSeatsCount(seats_count) {
        const seats = Number(seats_count);
        if (!Number.isInteger(seats) || seats <= 0) {
            throw new Error("A quantidade de lugares deve ser um numero inteiro maior que zero.");
        }
    }

    static validateSetupType(setup_type) {
        if (!ALLOWED_SETUP_TYPES.includes(setup_type)) {
            throw new Error(`Tipo de evento invalido. Valores permitidos: ${ALLOWED_SETUP_TYPES.join(', ')}.`);
        }
    }

    static validateEventStatus(event_status) {
        if (!ALLOWED_EVENT_STATUSES.includes(event_status)) {
            throw new Error(`Status do evento invalido. Valores permitidos: ${ALLOWED_EVENT_STATUSES.join(', ')}.`);
        }
    }

    static async validateRelations({ user_id, space_id, customer_id }) {
        const user = await UserModel.findById(user_id);
        if (!user) {
            throw new Error("Usuario nao encontrado.");
        }

        const space = await SpaceModel.getSpaceById(space_id);
        if (!space) {
            throw new Error("Espaco nao encontrado.");
        }

        const customer = await CustomerModel.findById(customer_id);
        if (!customer) {
            throw new Error("Cliente nao encontrado.");
        }
    }

    static async validateEventPayload(event) {
        const {
            user_id,
            space_id,
            customer_id,
            event_name,
            event_date,
            event_start,
            seats_count,
            setup_type,
            event_status
        } = event;

        if (!user_id) {
            throw new Error("O ID do usuario e obrigatorio.");
        }

        if (!space_id) {
            throw new Error("O ID do espaco e obrigatorio.");
        }

        if (!customer_id) {
            throw new Error("O ID do cliente e obrigatorio.");
        }

        if (!event_name) {
            throw new Error("O nome do evento e obrigatorio.");
        }

        if (!event_date) {
            throw new Error("A data do evento e obrigatoria.");
        }

        if (!event_start) {
            throw new Error("O inicio do evento e obrigatorio.");
        }

        if (seats_count === undefined || seats_count === null) {
            throw new Error("A quantidade de lugares e obrigatoria.");
        }

        EventService.validateEventDate(event_date);
        EventService.validateEventStart(event_start);
        EventService.validateSeatsCount(seats_count);
        EventService.validateSetupType(setup_type || 'pendente');
        EventService.validateEventStatus(event_status || 'nao_confirmado');
        await EventService.validateRelations({ user_id, space_id, customer_id });
    }

    // Cria um novo evento apos validacoes
    static async createEvent(event) {
        await EventService.validateEventPayload(event);

        const eventToCreate = {
            ...event,
            seats_count: Number(event.seats_count),
            setup_type: event.setup_type || 'pendente',
            event_status: event.event_status || 'nao_confirmado'
        };

        return await EventModel.create(eventToCreate);
    }

    // Atualiza informacoes de um evento existente
    static async updateEvent(id, event) {
        await EventService.validateEventPayload(event);

        const eventToUpdate = {
            ...event,
            seats_count: Number(event.seats_count),
            setup_type: event.setup_type || 'pendente',
            event_status: event.event_status || 'nao_confirmado'
        };

        const updatedRows = await EventModel.update(id, eventToUpdate);
        if (updatedRows === 0) {
            throw new Error("Evento nao encontrado.");
        }
        return updatedRows;
    }

    // Atualiza apenas o status de um evento
    static async updateEventStatus(id, event_status) {
        if (!event_status) {
            throw new Error("O status do evento e obrigatorio.");
        }

        EventService.validateEventStatus(event_status);

        const updatedRows = await EventModel.updateStatus(id, event_status);
        if (updatedRows === 0) {
            throw new Error("Evento nao encontrado.");
        }
        return updatedRows;
    }

    // Deleta um evento pelo ID
    static async deleteEvent(id) {
        const deletedRows = await EventModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Evento nao encontrado.");
        }
        return deletedRows;
    }
}

module.exports = EventService;
// Exporta a classe para ser utilizada pelos controllers
