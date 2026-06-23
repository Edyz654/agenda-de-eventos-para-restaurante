const SpaceModel = require("../models/spaceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela spaces)

const ALLOWED_SPACE_NAMES = ['cave', 'restaurante', 'restaurante_interno', 'deck', 'pergolado', 'jardim'];

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

    static validateSpaceName(name) {
        if (!name) {
            throw new Error("O nome do espaço é obrigatório.");
        }

        if (!ALLOWED_SPACE_NAMES.includes(name)) {
            throw new Error(`Nome de espaço inválido. Valores permitidos: ${ALLOWED_SPACE_NAMES.join(', ')}.`);
        }
    }

    // Cria um novo espaço após validações
    static async createSpace(space) {
        SpaceService.validateSpaceName(space.name);

        const existingSpaces = await SpaceModel.getSpaceByName(space.name);
        if (existingSpaces.length > 0) {
            throw new Error("Espaço já cadastrado.");
        }

        return await SpaceModel.create(space);
    }

    // Atualiza um espaço existente após validações
    static async updateSpace(id, space) {
        SpaceService.validateSpaceName(space.name);

        const existingSpace = await SpaceModel.getSpaceById(id);
        if (!existingSpace) {
            throw new Error("Espaço não encontrado.");
        }

        const spacesWithSameName = await SpaceModel.getSpaceByName(space.name);
        const isNameUsedByAnotherSpace = spacesWithSameName.some(
            (currentSpace) => Number(currentSpace.id) !== Number(id)
        );

        if (isNameUsedByAnotherSpace) {
            throw new Error("Já existe outro espaço com esse nome.");
        }

        return await SpaceModel.update(id, space);
    }
}


module.exports = SpaceService;
// Exporta a classe para ser utilizada pelos controllers
