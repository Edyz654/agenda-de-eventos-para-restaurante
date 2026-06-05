const bcrypt = require("bcryptjs"); // Importa a biblioteca para criptografia de senhas
const jwt = require("jsonwebtoken"); // Importa a biblioteca para geração de tokens JWT
const UserModel = require("../models/userModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela users)

const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail

class UserService {
    // Busca todos os usuários cadastrados
    static async getAllUsers() {
        return await UserModel.findAll();
    }

    // Cria um novo usuário após validações
    static async createUser(user) {
        if (!validateEmail(user.email)) {
            throw new Error("Formato de email inválido."); // Valida o formato do e-mail
        }

        if (!user.password) {
            throw new Error("A senha é obrigatória."); // Verifica se a senha foi fornecida
        }

        const existing = await UserModel.findByEmail(user.email);
        if (existing) {
            throw new Error("Email já cadastrado."); // Impede cadastro de e-mails duplicados
        }

        // Criptografa a senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Substitui a senha original pela versão criptografada
        user.password = hashedPassword;
        user.role = "user"; // Define o papel do usuário, padrão para "user" se não for fornecido

        // Cria o usuário no banco e retorna o ID do novo usuário criado
        const id = await UserModel.create(user);

        // Retorna os dados de sucesso (sem lançar erro)
        return { message: "Usuário criado com sucesso.", id };
    }

    // Método para autenticar um usuário e gerar um token JWT
    static async loginUser({ email, password }) {
        if (!email || !password) {
            throw new Error("Email e senha são obrigatórios."); // Verifica se ambos os campos foram fornecidos
        }

        // Verifica se a senha fornecida corresponde à senha armazenada (criptografada)
        const user = await UserModel.findByEmailWithPassword(email);
        if (!user) {
            throw new Error("Usuário não encontrado."); // Se o usuário não for encontrado, lança um erro
        }

        if (!user.password) {
            throw new Error("Senha não cadastrada para este usuário."); // Verifica se o usuário tem uma senha cadastrada
        }
        
        // Verifica se a senha fornecida é válida
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Senha inválida."); // Se a senha for inválida, lança um erro
        }

        // Verifica se a chave secreta para JWT está definida
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não configurado.");
        }

        // Gera um token JWT com o email e o papel do usuário
        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Retorna o token e o usuário para o controller
        return { 
            token, 
            user: { 
                email: user.email, 
                role: user.role 
            } 
        };
    }

    // Atualiza informações de um usuário existente
    static async updateUser(id, user) {
        const updatedRows = await UserModel.update(id, user);
        if (updatedRows === 0) {
            throw new Error("Usuário não encontrado."); // Caso nenhum usuário tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um usuário pelo ID
    static async deleteUser(id) {
        const deletedRows = await UserModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Usuário não encontrado."); // Caso nenhum usuário tenha sido deletado
        }
        return deletedRows;
    }
}

module.exports = UserService;
// Exporta a classe para ser utilizada pelos controllers