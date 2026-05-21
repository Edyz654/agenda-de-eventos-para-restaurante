const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class CustomerModel {
    // Busca todos os clientes
    static async getAllCustomers() {
        const [rows] = await db.query('SELECT * FROM customers');
        return rows;
    }

    // Busca um cliente pelo nome
    static async findByName(name) {
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE name LIKE ?',
            [`%${name}%`]);
        return rows;
    }

    // Busca um cliente pelo e-mail
    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE email = ?',
            [email]);
        return rows[0];
    }

    // Cria um novo cliente
    static async create(customer) {
        const { name, phone_number, email, cpf, address } = customer;
        const [result] = await db.query(
            'INSERT INTO customers (name, email, phone_number, cpf, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone_number, cpf, address]);
        return result.insertId; // Retorna o ID do cliente criado
    }

    // Atualiza um cliente existente
    static async update(id, customer) {
        const { name, email, phone_number, cpf, address } = customer;
        const [result] = await db.query(
            'UPDATE customers SET name = ?, email = ?, phone_number = ?, cpf = ?, address = ? WHERE id = ? ',
            [name, email, phone_number, cpf, address, id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um cliente pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = CustomerModel;
// Exporta a classe CustomerModel para ser usada nos services