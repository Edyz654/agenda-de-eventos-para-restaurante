const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class SpaceModel {
    // Busca todos os espaços
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM spaces');
        return rows;
    }

    // Busca um espaço pelo ID
    static async findByID(id) {
        const [rows] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByLocation(event_location) {
        const [rows] = await db.query(
            'SELECT * FROM spaces WHERE event_location = ?',
            [event_location]
        );

        return rows;
    }


    // Atualiza o local de um evento existente
    static async update(id, space) {
        const { event_location, setup_type } = space;

        const [result] = await db.query('UPDATE spaces SET event_location = ?, setup_type = ? WHERE id = ? ', [event_location, setup_type, id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Atualiza o local e o espaço de um evento pelo ID alterando para 'pendente'
    static async marcarPendente(id) {
        const [result] = await db.query('UPDATE spaces SET event_location = ?, setup_type = ? WHERE id = ?', ['pendente', 'pendente', id]);

        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = SpaceModel;
// Exporta a classe SpaceModel para ser usada nos services