# 🧪 Guia de Testes - Quadras API

## 🚀 Iniciando a Aplicação

### 1. Subir os containers Docker

```bash
# Parar qualquer container anterior
docker-compose down

# Limpar porta 4000 (se necessário)
lsof -ti:4000 | xargs kill -9 2>/dev/null

# Subir os containers
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f api
```

### 2. Criar e migrar o banco de dados

```bash
# Entrar no container
docker-compose exec api sh

# Criar o banco
mix ecto.create

# Rodar migrations
mix ecto.migrate

# Sair do container
exit
```

### 3. Verificar se está rodando

```bash
# Health check
curl http://localhost:4000/api/health

# Deve retornar:
# {"status":"ok","timestamp":"2026-01-15T16:30:00Z"}
```

---

## 📋 Testando os Endpoints

### 1️⃣ Autenticação

#### Registrar um usuário

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "senha123",
      "phone": "+5511999999999",
      "preferred_position": "atacante",
      "dominant_foot": "destro"
    }
  }'
```

**Resposta esperada:**
```json
{
  "data": {
    "user": {
      "id": "uuid-aqui",
      "name": "João Silva",
      "email": "joao@example.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE: Copie o `token` retornado!**

#### Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Ver perfil atual (protegido)

```bash
# Substitua SEU_TOKEN pelo token recebido no registro/login
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 2️⃣ Times (Teams)

#### Criar um time

```bash
curl -X POST http://localhost:4000/api/v1/teams \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "team": {
      "name": "Raça Tricolor",
      "tag": "RACA",
      "description": "Time de futsal competitivo",
      "team_type": "primary"
    }
  }'
```

**Resposta esperada:**
```json
{
  "data": {
    "id": "team-uuid",
    "name": "Raça Tricolor",
    "tag": "RACA",
    "mmr": "1000",
    "rank_tier": "Bronze",
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "captain_id": "seu-user-id"
  }
}
```

**⚠️ Copie o `id` do time!**

#### Listar times

```bash
curl http://localhost:4000/api/v1/teams
```

#### Ver detalhes de um time

```bash
curl http://localhost:4000/api/v1/teams/TEAM_ID
```

---

### 3️⃣ Quadras (Venues)

#### Criar uma quadra

```bash
curl -X POST http://localhost:4000/api/v1/venues \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "venue": {
      "name": "Arena Sports Center",
      "address": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "lat": -23.550520,
      "lng": -46.633308,
      "opening_time": "08:00:00",
      "closing_time": "22:00:00",
      "hourly_rate": "150.00",
      "amenities": ["vestiario", "estacionamento", "lanchonete"]
    }
  }'
```

**⚠️ Copie o `id` da venue!**

#### Buscar quadras próximas (GEO-QUERY com PostGIS!)

```bash
# Buscar quadras num raio de 10km
curl "http://localhost:4000/api/v1/venues/nearby?lat=-23.550520&lng=-46.633308&radius=10"
```

**Resposta esperada:**
```json
{
  "data": [
    {
      "id": "venue-uuid",
      "name": "Arena Sports Center",
      "city": "São Paulo",
      "distance_km": 2.34,
      "coordinates": {
        "lat": -23.550520,
        "lng": -46.633308
      }
    }
  ]
}
```

#### Listar todas as quadras

```bash
curl http://localhost:4000/api/v1/venues
```

---

### 4️⃣ Matchmaking

#### Entrar na fila de uma quadra

```bash
curl -X POST http://localhost:4000/api/v1/venues/VENUE_ID/lobby/join \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "SEU_TEAM_ID",
    "available_from": "18:00:00",
    "available_until": "22:00:00"
  }'
```

#### Ver fila de uma quadra

```bash
curl http://localhost:4000/api/v1/venues/VENUE_ID/lobby
```

#### Criar um desafio (challenge)

```bash
curl -X POST http://localhost:4000/api/v1/challenges \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "challenge": {
      "challenger_team_id": "SEU_TEAM_ID",
      "challenged_team_id": "OUTRO_TEAM_ID",
      "venue_id": "VENUE_ID",
      "proposed_datetime": "2026-01-20T19:00:00Z",
      "is_ranked": true,
      "message": "Bora jogar?"
    }
  }'
```

**⚠️ Copie o `id` do challenge!**

#### Aceitar um desafio (cria uma partida)

```bash
curl -X POST http://localhost:4000/api/v1/challenges/CHALLENGE_ID/accept \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Isso cria automaticamente um `Match`!**

---

### 5️⃣ Partidas (Matches)

#### Ver detalhes de uma partida

```bash
curl http://localhost:4000/api/v1/matches/MATCH_ID
```

#### Reportar placar (time da casa)

```bash
curl -X POST http://localhost:4000/api/v1/matches/MATCH_ID/score \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "side": "home",
    "home_score": 5,
    "away_score": 3
  }'
```

#### Confirmar placar (time visitante)

```bash
curl -X POST http://localhost:4000/api/v1/matches/MATCH_ID/confirm \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "side": "away"
  }'
```

**Quando ambos os times confirmam, a partida finaliza e o MMR é calculado automaticamente!**

#### Listar partidas de um time

```bash
curl "http://localhost:4000/api/v1/teams/TEAM_ID/matches?status=finished&limit=10"
```

---

## 🧰 Ferramentas Recomendadas

### Postman / Insomnia

1. Importe a collection (criar arquivo `quadras.postman.json`)
2. Configure variável de ambiente `{{token}}`
3. Configure variável `{{base_url}}` = `http://localhost:4000`

### cURL com variáveis

```bash
# Salvar token
export TOKEN="seu-token-aqui"
export TEAM_ID="seu-team-id"
export VENUE_ID="venue-id"

# Usar nas requisições
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Verificando o Banco de Dados

```bash
# Entrar no container do PostgreSQL
docker-compose exec db psql -U postgres -d quadras_dev

# Ver usuários
SELECT id, name, email, mmr_individual FROM users;

# Ver times
SELECT id, name, tag, mmr, rank_tier, wins, losses FROM teams;

# Ver partidas
SELECT id, status, home_score, away_score, winner_id FROM matches;

# Sair
\q
```

---

## 🐛 Troubleshooting

### Porta 4000 em uso

```bash
lsof -ti:4000 | xargs kill -9
docker-compose down
docker-compose up -d
```

### Banco não conecta

```bash
# Verificar se o container do DB está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Recriar banco
docker-compose exec api mix ecto.drop
docker-compose exec api mix ecto.create
docker-compose exec api mix ecto.migrate
```

### Recompilar código

```bash
docker-compose exec api mix compile --force
```

### Ver logs em tempo real

```bash
docker-compose logs -f api
```

---

## 📊 Fluxo Completo de Teste

```bash
# 1. Registrar 2 usuários
# 2. Cada um cria um time
# 3. Criar uma quadra
# 4. Time 1 desafia Time 2
# 5. Time 2 aceita (cria partida)
# 6. Ambos reportam placar
# 7. Verificar MMR atualizado
# 8. Verificar rank_tier dos times
```

---

## ✅ Checklist de Funcionalidades

- [ ] Health check responde
- [ ] Registro de usuário funciona
- [ ] Login retorna token
- [ ] Endpoint protegido `/me` funciona
- [ ] Criar time funciona
- [ ] Criar quadra funciona
- [ ] Busca geo (nearby) retorna resultados
- [ ] Entrar na fila funciona
- [ ] Criar desafio funciona
- [ ] Aceitar desafio cria partida
- [ ] Reportar placar funciona
- [ ] MMR é calculado após partida
- [ ] Rank tier é atualizado

---

**🎯 Pronto! Agora você pode testar toda a API do Quadras!**
