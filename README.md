# Agenda de Eventos para Restaurante

API para cadastrar clientes e gerenciar eventos de um restaurante.

## Rodar o projeto

```bash
npm install
npm run dev
```

A documentacao Swagger fica disponivel em:

```txt
http://localhost:3000/api-docs
```

O frontend para testar a API fica em:

```txt
http://localhost:3000
```

A especificacao OpenAPI em JSON fica em:

```txt
http://localhost:3000/api-docs.json
```

Para testar rotas protegidas no Swagger:

1. Faca login em `POST /auth/login`.
2. Copie o campo `token` retornado.
3. Clique em `Authorize` no Swagger.
4. Informe o token JWT.

Crie um arquivo `.env` com as credenciais do MySQL e a chave JWT:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=agenda_de_eventos_db
JWT_SECRET=sua_chave
```

## Evento

Payload para criar ou atualizar um evento:

```json
{
  "user_id": 1,
  "space_id": 1,
  "customer_id": 1,
  "event_name": "Evento de Teste",
  "event_description": "Reserva para jantar corporativo",
  "event_date": "2026-06-10",
  "event_start": "2026-06-10 19:00:00",
  "seats_count": 30,
  "setup_type": "buffet",
  "event_status": "nao_confirmado"
}
```

Tipos permitidos em `setup_type`:

```txt
buffet, coquetel, a_la_carte, reuniao, auditorio, pendente
```

Status permitidos em `event_status`:

```txt
confirmado, nao_confirmado
```

Para confirmar ou negar um evento sem alterar o restante dos dados:

```http
PATCH /events/:id/status
Authorization: Bearer <token_admin>
Content-Type: application/json
```

```json
{
  "event_status": "confirmado"
}
```

## Banco existente

Se a tabela `events` ja existir, rode:

```sql
SOURCE src/database/alter_events_add_seats_count.sql;
```
