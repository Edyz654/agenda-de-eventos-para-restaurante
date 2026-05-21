const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class EventModel {
    // Busca todos os eventos
    static async getAllEvents() {
        const [rows] = await db.query('SELECT * FROM events');
        return rows;
    }

    // Busca um evento pelo nome
    static async findByName(name) {
        const [rows] = await db.query(
            'SELECT * FROM events WHERE name LIKE ?',
            [`%${name}%`]);
        return rows;
    }

    // Busca um evento pela data
    static async findByDate(date) {
        const [rows] = await db.query(
            'SELECT * FROM events WHERE date = ?',
            [date]);
        return rows[0];
    }

    // Cria um novo evento
    static async create(event) {
        const { user_id, space_id, customer_id, event_name, event_date } = event;
        const [result] = await db.query(
            'INSERT INTO events (user_id, space_id, customer_id, name, date) VALUES (?, ?, ?, ?, ?)',
            [user_id, space_id, customer_id, event_name, event_date]);
        return result.insertId; // Retorna o ID do evento criado
    }

    // Atualiza um evento existente
    static async update(id, event) {
        const { user_id, space_id, customer_id, event_name, event_date } = event;
        const [result] = await db.query(
            'UPDATE events SET user_id = ?, space_id = ?, customer_id = ?, name = ?, date = ? WHERE id = ? ',
            [user_id, space_id, customer_id, event_name, event_date, id]);
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