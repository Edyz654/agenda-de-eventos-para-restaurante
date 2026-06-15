const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Agenda de Eventos para Restaurante API',
        version: '1.0.0',
        description: 'API para cadastro de clientes e gerenciamento de eventos de um restaurante.'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local'
        }
    ],
    tags: [
        { name: 'Auth', description: 'Autenticacao e cadastro de usuarios' },
        { name: 'Users', description: 'Usuarios do sistema' },
        { name: 'Customers', description: 'Clientes do restaurante' },
        { name: 'Spaces', description: 'Ambientes disponiveis para eventos' },
        { name: 'Events', description: 'Agenda de eventos' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Mensagem de erro.' },
                    message: { type: 'string', example: 'Mensagem de erro.' }
                }
            },
            AuthRegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Novo Usuario' },
                    email: { type: 'string', format: 'email', example: 'novo_usuario@example.com' },
                    phone_number: { type: 'string', example: '11999999988' },
                    password: { type: 'string', format: 'password', example: 'nova_senha' }
                }
            },
            AuthLoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'novo_usuario@example.com' },
                    password: { type: 'string', format: 'password', example: 'nova_senha' }
                }
            },
            AuthLoginResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: {
                        type: 'object',
                        properties: {
                            email: { type: 'string', example: 'novo_usuario@example.com' },
                            role: { type: 'string', example: 'user' }
                        }
                    }
                }
            },
            UserCreateRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Maria Admin' },
                    email: { type: 'string', format: 'email', example: 'maria.admin@example.com' },
                    phone_number: { type: 'string', example: '11999999999' },
                    password: { type: 'string', format: 'password', example: 'senha_segura' }
                }
            },
            UserUpdateRequest: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                    name: { type: 'string', example: 'Maria Admin Atualizada' },
                    email: { type: 'string', format: 'email', example: 'maria.admin@example.com' },
                    phone_number: { type: 'string', example: '11988888888' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Maria Admin' },
                    email: { type: 'string', example: 'maria.admin@example.com' },
                    phone_number: { type: 'string', nullable: true, example: '11999999999' },
                    role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
                    created_at: { type: 'string', format: 'date-time' }
                }
            },
            CustomerRequest: {
                type: 'object',
                required: ['name', 'phone_number'],
                properties: {
                    name: { type: 'string', example: 'Carlos Cliente' },
                    phone_number: { type: 'string', example: '11999999999' },
                    email: { type: 'string', format: 'email', nullable: true, example: 'carlos@cliente.com' },
                    cpf: { type: 'string', nullable: true, example: '01234567800' },
                    address: { type: 'string', nullable: true, example: 'Rua das Rosas, 178, Sao Paulo, SP' }
                }
            },
            Customer: {
                allOf: [
                    { $ref: '#/components/schemas/CustomerRequest' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            Space: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: {
                        type: 'string',
                        enum: ['cave', 'restaurante', 'restaurante_interno', 'deck', 'pergolado', 'jardim'],
                        example: 'deck'
                    },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            EventRequest: {
                type: 'object',
                required: ['user_id', 'space_id', 'customer_id', 'event_name', 'event_date', 'event_start', 'seats_count'],
                properties: {
                    user_id: { type: 'integer', example: 1 },
                    space_id: { type: 'integer', example: 1 },
                    customer_id: { type: 'integer', example: 1 },
                    event_name: { type: 'string', example: 'Evento de Teste' },
                    event_description: { type: 'string', nullable: true, example: 'Reserva para jantar corporativo' },
                    event_date: { type: 'string', pattern: '^\\d{2}/\\d{2}/\\d{2}$', example: '10/06/26' },
                    event_start: { type: 'string', example: '10/06/26 19:00:00' },
                    seats_count: { type: 'integer', minimum: 1, example: 30 },
                    setup_type: {
                        type: 'string',
                        enum: ['buffet', 'coquetel', 'a_la_carte', 'reuniao', 'auditorio', 'pendente'],
                        default: 'pendente',
                        example: 'buffet'
                    },
                    event_status: {
                        type: 'string',
                        enum: ['confirmado', 'nao_confirmado'],
                        default: 'nao_confirmado',
                        example: 'nao_confirmado'
                    },
                    uploads_url: { type: 'string', nullable: true, example: 'https://example.com/contrato.pdf' }
                }
            },
            Event: {
                allOf: [
                    { $ref: '#/components/schemas/EventRequest' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            EventStatusRequest: {
                type: 'object',
                required: ['event_status'],
                properties: {
                    event_status: {
                        type: 'string',
                        enum: ['confirmado', 'nao_confirmado'],
                        example: 'confirmado'
                    }
                }
            },
            MessageResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Operacao realizada com sucesso.' },
                    id: { type: 'integer', example: 1 }
                }
            }
        }
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Cadastrar usuario',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthRegisterRequest' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Usuario criado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    409: { description: 'Erro de cadastro', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthLoginRequest' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Login realizado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthLoginResponse' } } } },
                    401: { description: 'Credenciais invalidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/users': {
            get: {
                tags: ['Users'],
                summary: 'Listar usuarios',
                responses: {
                    200: { description: 'Lista de usuarios', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
                }
            },
            post: {
                tags: ['Users'],
                summary: 'Criar usuario',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreateRequest' } } }
                },
                responses: {
                    201: { description: 'Usuario criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Dados invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/users/{id}': {
            put: {
                tags: ['Users'],
                summary: 'Atualizar usuario',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserUpdateRequest' } } } },
                responses: {
                    200: { description: 'Usuario atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao atualizar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            delete: {
                tags: ['Users'],
                summary: 'Deletar usuario',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Usuario deletado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao deletar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/customers': {
            get: {
                tags: ['Customers'],
                summary: 'Listar clientes',
                responses: {
                    200: { description: 'Lista de clientes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Customer' } } } } }
                }
            },
            post: {
                tags: ['Customers'],
                summary: 'Criar cliente',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerRequest' } } } },
                responses: {
                    201: { description: 'Cliente criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Dados invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/customers/search': {
            get: {
                tags: ['Customers'],
                summary: 'Buscar clientes por nome',
                parameters: [{ name: 'name', in: 'query', required: true, schema: { type: 'string' }, example: 'Carlos' }],
                responses: {
                    200: { description: 'Clientes encontrados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Customer' } } } } },
                    400: { description: 'Parametro invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/customers/{id}': {
            put: {
                tags: ['Customers'],
                summary: 'Atualizar cliente',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerRequest' } } } },
                responses: {
                    200: { description: 'Cliente atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao atualizar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            },
            delete: {
                tags: ['Customers'],
                summary: 'Deletar cliente',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Cliente deletado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao deletar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/spaces': {
            get: {
                tags: ['Spaces'],
                summary: 'Listar ambientes',
                responses: {
                    200: { description: 'Lista de ambientes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Space' } } } } }
                }
            }
        },
        '/spaces/id/{id}': {
            get: {
                tags: ['Spaces'],
                summary: 'Buscar ambiente por ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Ambiente encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Space' } } } },
                    400: { description: 'Erro na busca', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/spaces/name/{name}': {
            get: {
                tags: ['Spaces'],
                summary: 'Buscar ambiente por nome',
                parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string', enum: ['cave', 'restaurante', 'restaurante_interno', 'deck', 'pergolado', 'jardim'] } }],
                responses: {
                    200: { description: 'Ambientes encontrados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Space' } } } } },
                    400: { description: 'Erro na busca', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/events': {
            get: {
                tags: ['Events'],
                summary: 'Listar eventos',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Lista de eventos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } } },
                    401: { description: 'Token nao enviado' },
                    403: { description: 'Token invalido' }
                }
            },
            post: {
                tags: ['Events'],
                summary: 'Criar evento',
                description: 'Requer usuario admin.',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventRequest' } } } },
                responses: {
                    201: { description: 'Evento criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Dados invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    403: { description: 'Acesso negado' }
                }
            }
        },
        '/events/search': {
            get: {
                tags: ['Events'],
                summary: 'Buscar eventos por nome',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'name', in: 'query', required: true, schema: { type: 'string' }, example: 'Evento' }],
                responses: {
                    200: { description: 'Eventos encontrados', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } } },
                    400: { description: 'Parametro invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/events/{id}': {
            put: {
                tags: ['Events'],
                summary: 'Atualizar evento',
                description: 'Requer usuario admin.',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventRequest' } } } },
                responses: {
                    200: { description: 'Evento atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao atualizar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    403: { description: 'Acesso negado' }
                }
            },
            delete: {
                tags: ['Events'],
                summary: 'Deletar evento',
                description: 'Requer usuario admin.',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'Evento deletado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao deletar', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    403: { description: 'Acesso negado' }
                }
            }
        },
        '/events/{id}/status': {
            patch: {
                tags: ['Events'],
                summary: 'Atualizar status do evento',
                description: 'Requer usuario admin.',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventStatusRequest' } } } },
                responses: {
                    200: { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Erro ao atualizar status', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    403: { description: 'Acesso negado' }
                }
            }
        }
    }
};

module.exports = swaggerDocument;
