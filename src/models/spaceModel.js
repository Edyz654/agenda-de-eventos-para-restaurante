const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class SpaceModel {
    // Busca todos os espaços
    static async getAllSpaces() {
        const [rows] = await db.query('SELECT * FROM spaces');
        return rows;
    }

    // Busca um espaço pelo ID
    static async getSpaceById(id) {
        const [rows] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        return rows[0];
    }

    static async getSpaceByName(name) {
        const [rows] = await db.query(
            'SELECT * FROM spaces WHERE name = ?',
            [name]
        );

        return rows;
    }

    // Cria um novo espaço
    static async create(space) {
        const { name } = space;
        const [result] = await db.query(
            'INSERT INTO spaces (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    }

    // Atualiza um espaço existente
    static async update(id, space) {
        const { name } = space;
        const [result] = await db.query(
            'UPDATE spaces SET name = ? WHERE id = ?',
            [name, id]
        );
        return result.affectedRows;
    }
}

module.exports = SpaceModel;
// Exporta a classe SpaceModel para ser usada nos services
