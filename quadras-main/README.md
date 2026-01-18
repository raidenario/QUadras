# Guia da API do Quadras ⚽️

Oi! Fiz este guia especialmente para você conseguir desenvolver o frontend do nosso app sem dores de cabeça. Aqui tem tudo sobre como a API funciona, quais dados ela espera e como testar.

## 🚀 Como Rodar

Se a API estiver rodando na sua máquina via Docker, a URL base será:

```
http://localhost:4000
```

Se estivermos em produção (ou eu estiver rodando no meu PC e você acessando pela rede), substitua pelo IP correto.

## 🔐 Autenticação

A API usa **JWT (JSON Web Token)**. Quase tudo que não for login/registro vai precisar que você envie esse token.

### Header de Autorização
Em todas as requisições protegidas (que precisam de login), adicione este header:

```
Authorization: Bearer <SEU_TOKEN_AQUI>
```

> **Dica**: Quando fizer o login ou cadastro, a API vai devolver o `token`. Guarde ele no `localStorage` ou nos Cookies.

---

## 📚 Endpoints Principais

### 1. Autenticação (`/api/v1/auth`)

#### **Login**
- **URL**: `POST /api/v1/auth/login`
- **Body** (JSON):
  ```json
  {
    "email": "gatinha@email.com",
    "password": "senha123"
  }
  ```
- **Resposta Sucesso**: Retorna o User e o Token.

#### **Cadastro (Register)**
- **URL**: `POST /api/v1/auth/register`
- **Body** (JSON):
  ```json
  {
    "user": {
      "name": "Sua Linda",
      "email": "gatinha@email.com",
      "password": "senha123",
      "phone": "5511999999999",       // Opcional
      "dominant_foot": "destro",      // "destro", "canhoto" ou "ambidestro" - Opcional
      "preferred_position": "Atacante" // Opcional
    }
  }
  ```

#### **Dados do Usuário Atual (Me)**
- **URL**: `GET /api/v1/auth/me`
- **Header**: Precisa do Token!
- **Resposta**: Retorna os dados completos do seu perfil.

#### **Atualizar Localização**
- **URL**: `PUT /api/v1/auth/location`
- **Body** (JSON):
  ```json
  {
    "latitude": -23.550520,
    "longitude": -46.633308
  }
  ```
- Útil para mostrarmos quadras perto de você!

---

### 2. Times (`/api/v1/teams`)

#### **Listar Todos os Times**
- **URL**: `GET /api/v1/teams`
- **Query Params** (Filtros Opcionais):
  - `?q=nome`: Pesquisar por nome.
  - `?rank_tier=Ouro`: Filtrar por ranking.

#### **Criar Time**
- **URL**: `POST /api/v1/teams`
- **Body** (JSON):
  ```json
  {
    "team": {
      "name": "Os Vingadores",
      "tag": "VING",             // 2 a 4 caracteres, só letras/números
      "description": "Time da pesada",
      "logo_url": "https://...", // Opcional
      "team_type": "primary"     // "primary" ou "secondary"
    }
  }
  ```
- **Nota**: Quem cria vira automaticamente o **Capitão**.

#### **Meu Time Principal**
- **URL**: `GET /api/v1/teams/me`
- **Resposta**: Retorna os detalhes do seu time principal, incluindo membros.

#### **Todos os Meus Times**
- **URL**: `GET /api/v1/teams/my-teams`
- **Resposta**: Lista todos os times que você participa.

#### **Gerenciar Membros**
- **Adicionar**: `POST /api/v1/teams/:id/members` → Body: `{ "user_id": "id-do-usuario" }`
- **Remover**: `DELETE /api/v1/teams/:id/members/:user_id`

---

### 3. Quadras / Venues (`/api/v1/venues`)

#### **Listar Quadras**
- **URL**: `GET /api/v1/venues`
- **Query Params**:
  - `?city=São Paulo`: Filtrar por cidade.
  - `?limit=10`: Limitar resultados.

#### **Quadras Próximas (Geolocalização)**
- **URL**: `GET /api/v1/venues/nearby`
- **Query Params**:
  - `?lat=-23.55&lng=-46.63` (Obrigatórios)
  - `?radius=15` (Raio em Km, padrão é 10)

#### **Detalhes da Quadra**
- **URL**: `GET /api/v1/venues/:id`
- **Resposta**: Traz info da quadra e lista de campos/fields.

#### **Ver Campos Disponíveis**
- **URL**: `GET /api/v1/venues/:venue_id/fields`

---

### 4. Agendamento e Partidas

O sistema funciona assim: um time "Reserva" (Book) um horário, criando uma **Partida Aberta**. Outro time pode ver essa partida e **Entrar** (Join).

#### **Ver Horários de um Campo**
- **URL**: `GET /api/v1/fields/:field_id/slots?date=2026-01-20`
- **Importante**: A data deve ser `YYYY-MM-DD`. Retorna slots livres (`free`), abertos (`open`, esperando oponente) ou confirmados (`confirmed`).

#### **Reservar Horário (Criar Partida)**
- **URL**: `POST /api/v1/fields/:field_id/book`
- **Body** (JSON):
  ```json
  {
    "team_id": "id-do-seu-time",
    "slot_start": "2026-01-20T18:00:00Z", // Formato ISO8601 (UTC)
    "is_ranked": true
  }
  ```
- Só o **Capitão** pode fazer isso.

#### **Ver Partidas Abertas (Desafios)**
- **URL**: `GET /api/v1/venues/:venue_id/open-matches`
- Lista partidas que estão esperando um oponente naquela quadra.

#### **Entrar numa Partida (Aceitar Desafio)**
- **URL**: `POST /api/v1/matches/:match_id/join`
- **Body**: `{ "team_id": "id-do-seu-time" }`

---

## 🛠 Dicas de Desenvolvimento

1. **Erros 401 (Unauthorized)**: Geralmente é o Token expirado ou não enviado. Tente fazer login de novo.
2. **Erros 422 (Unprocessable Entity)**: Significa que você mandou algum dado errado (ex: senha curta demais, email inválido, ou faltou campo obrigatório). Olha o `response.data` que a API te diz qual campo errou.
3. **Imagens**: Por enquanto mandamos apenas a URL (string). O upload de arquivo real a gente vê depois!

Qualquer dúvida me grita! ❤️
