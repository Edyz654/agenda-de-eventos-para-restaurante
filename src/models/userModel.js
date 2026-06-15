const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class UserModel {
    // Busca todos os usuários
    static async findAll() {
        const [rows] = await db.query('SELECT id, name, email, phone_number, role, created_at FROM users');
        return rows;
    }

    // Busca um usuário pelo email
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT id, name, email, phone_number, role, created_at FROM users WHERE email = ?',
            [email]);
        return rows[0];
    }

    // Busca um usuÃ¡rio pelo ID
    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, name, email, phone_number, role, created_at FROM users WHERE id = ?',
            [id]);
        return rows[0];
    }

    static async findByEmailWithPassword(email) {
        const [rows] = await db.query(
            'SELECT id, name, email, password, role FROM users WHERE email = ?',
            [email]);
        return rows[0];
    }

    // Cria um novo usuário
    static async create(user) {
        const { name, email, phone_number, password, role } = user;
        const [result] = await db.query('INSERT INTO users (name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)', [name, email, phone_number, password, role]);
        return result.insertId; // Retorna o ID do usuário criado
    }

    // Atualiza um usuário existente
    static async update(id, user) {
        const { name, email, phone_number } = user;
        const [result] = await db.query('UPDATE users SET name = ?, email = ?, phone_number = ? WHERE id = ? ', [name, email, phone_number, id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um usuário pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = UserModel;
// Exporta a classe UserModel para ser usada nos services
