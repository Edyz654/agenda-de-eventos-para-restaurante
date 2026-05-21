const SpaceModel = require("../models/spaceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela spaces)

const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail

class SpaceService {
    // Busca todos os espaços cadastrados
    static async getAllSpaces() {
        return await SpaceModel.getAllSpaces();
    }

    // Busca espaços pelo ID
    static async getSpaceById(id) {
        if (!id) {
            throw new Error("O ID é obrigatório para busca."); // Valida se o ID foi fornecido
        }

        return await SpaceModel.findById(id);
    }

  
    // Atualiza informações de um espaço existente
    static async updateSpace(id, space) {
        const updatedRows = await SpaceModel.update(id, space);
        if (updatedRows === 0) {
            throw new Error("Cliente não encontrado."); // Caso nenhum cliente tenha sido atualizado
        }
        return updatedRows;
    }
}

module.exports = SpaceService;
// Exporta a classe para ser utilizada pelos controllers