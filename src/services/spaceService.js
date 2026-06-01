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

        return await SpaceModel.getSpaceById(id);
    }

  
    // Busca espaços pelo nome
    static async getSpaceByName(name) {
        if (!name) {
            throw new Error("O nome é obrigatório para busca."); // Valida se o nome foi fornecido
        }

        return await SpaceModel.getSpaceByName(name);
    }  
}


module.exports = SpaceService;
// Exporta a classe para ser utilizada pelos controllers