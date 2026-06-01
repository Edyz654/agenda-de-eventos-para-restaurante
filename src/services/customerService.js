const CustomerModel = require("../models/customerModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela customers)

const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail

class CustomerService {
    // Busca todos os clientes cadastrados
    static async getAllCustomers() {
        return await CustomerModel.getAllCustomers();
    }

    // Busca clientes pelo nome
    static async getCustomersByName(name) {
        if (!name) {
            throw new Error("O nome é obrigatório para busca."); // Valida se o nome foi fornecido
        }

        return await CustomerModel.findByName(name);
    }

    // Cria um novo cliente após validações
    static async createCustomer(customer) {
        const { name, phone_number, email } = customer;

        if (!name) {
            throw new Error("O nome é obrigatório."); // Valida se o nome foi fornecido
        }

        if (!phone_number) {
            throw new Error("O número de telefone é obrigatório."); // Valida se o número de telefone foi fornecido
        }

        if (email && !validateEmail(email)) {
            throw new Error("Formato de email inválido."); // Valida o formato do e-mail
        }

        if (email) {
            const existingCustomer = await CustomerModel.findByEmail(customer.email);
            if (existingCustomer) {
                throw new Error("Email já cadastrado."); // Impede cadastro de e-mails duplicados
            }
        }

        return await CustomerModel.create(customer); // Cria o novo cliente
    }

    // Atualiza informações de um cliente existente
    static async updateCustomer(id, customer) {
        const updatedRows = await CustomerModel.update(id, customer);
        if (updatedRows === 0) {
            throw new Error("Cliente não encontrado."); // Caso nenhum cliente tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um cliente pelo ID
    static async deleteCustomer(id) {
        const deletedRows = await CustomerModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Cliente não encontrado."); // Caso nenhum cliente tenha sido deletado
        }
        return deletedRows;
    }
}

module.exports = CustomerService;
// Exporta a classe para ser utilizada pelos controllers