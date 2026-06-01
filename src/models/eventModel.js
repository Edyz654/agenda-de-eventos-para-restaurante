const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class EventModel {
    // Busca todos os eventos
    static async getAllEvents() {
        const [rows] = await db.query('SELECT * FROM events');
        return rows;
    }

    // Busca um evento pelo nome
    static async findByName(event_name) {
        const [rows] = await db.query(
            'SELECT * FROM events WHERE event_name LIKE ?',
            [`%${event_name}%`]);
        return rows;
    }

    // Busca um evento pela data
    static async findByDate(event_date) {
        const [rows] = await db.query(
            'SELECT * FROM events WHERE event_date = ?',
            [event_date]);
        return rows[0];
    }

    // Cria um novo evento
    static async create(event) {
        const { user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status, uploads_url } = event;
        const [result] = await db.query(
            'INSERT INTO events (user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status, uploads_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status, uploads_url]);
        return result.insertId; // Retorna o ID do evento criado
    }

    // Atualiza um evento existente
    static async update(id, event) {
        const { user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status, uploads_url} = event;
        const [result] = await db.query(
            'UPDATE events SET user_id = ?, space_id = ?, customer_id = ?, event_name = ?, event_description = ?, event_date = ?, event_start = ?, setup_type = ?, event_status = ?, uploads_url = ? WHERE id = ? ',
            [user_id, space_id, customer_id, event_name, event_description, event_date, event_start, setup_type, event_status, uploads_url, id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um evento pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = EventModel;
// Exporta a classe EventModel para ser usada nos services