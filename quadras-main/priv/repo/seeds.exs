# Script for populating the database with test data
# Run with: mix run priv/repo/seeds.exs

alias Quadras.Repo
alias Quadras.Contexts.Accounts
alias Quadras.Contexts.Teams
alias Quadras.Contexts.Venues
alias Quadras.Contexts.Matchmaking
alias Quadras.Schemas.{User, Team, TeamMember, Venue, Field, Lobby, QueueTicket, Challenge, Match, MatchPlayer}

# # Clear existing data (optional - comment out if you want to keep existing data)
# IO.puts("🗑️  Cleaning database...")
# Repo.delete_all(MatchPlayer)
# Repo.delete_all(Match)
# Repo.delete_all(Challenge)
# Repo.delete_all(QueueTicket)
# Repo.delete_all(Lobby)
# Repo.delete_all(Field)
# Repo.delete_all(TeamMember)
# Repo.delete_all(Team)
# Repo.delete_all(Venue)
# Repo.delete_all(User)

IO.puts("✅ Database cleaned!")

# ==============================================================================
# USERS
# ==============================================================================
IO.puts("\n👥 Creating users...")

users_data = [
  %{
    name: "João Silva",
    email: "joao@quadras.com",
    password: "senha123",
    phone: "+5511999991111",
    preferred_position: "atacante",
    dominant_foot: "destro",
    mmr_individual: Decimal.new("1200")
  },
  %{
    name: "Maria Santos",
    email: "maria@quadras.com",
    password: "senha123",
    phone: "+5511999992222",
    preferred_position: "goleiro",
    dominant_foot: "destro",
    mmr_individual: Decimal.new("1100")
  },
  %{
    name: "Pedro Costa",
    email: "pedro@quadras.com",
    password: "senha123",
    phone: "+5511999993333",
    preferred_position: "zagueiro",
    dominant_foot: "canhoto",
    mmr_individual: Decimal.new("1050")
  },
  %{
    name: "Ana Oliveira",
    email: "ana@quadras.com",
    password: "senha123",
    phone: "+5511999994444",
    preferred_position: "meio-campo",
    dominant_foot: "destro",
    mmr_individual: Decimal.new("1300")
  },
  %{
    name: "Carlos Mendes",
    email: "carlos@quadras.com",
    password: "senha123",
    phone: "+5511999995555",
    preferred_position: "atacante",
    dominant_foot: "ambidestro",
    mmr_individual: Decimal.new("1400")
  },
  %{
    name: "Juliana Lima",
    email: "juliana@quadras.com",
    password: "senha123",
    phone: "+5511999996666",
    preferred_position: "ala",
    dominant_foot: "destro",
    mmr_individual: Decimal.new("1150")
  },
  %{
    name: "Roberto Alves",
    email: "roberto@quadras.com",
    password: "senha123",
    phone: "+5511999997777",
    preferred_position: "fixo",
    dominant_foot: "destro",
    mmr_individual: Decimal.new("1250")
  },
  %{
    name: "Fernanda Rocha",
    email: "fernanda@quadras.com",
    password: "senha123",
    phone: "+5511999998888",
    preferred_position: "pivô",
    dominant_foot: "canhoto",
    mmr_individual: Decimal.new("1350")
  }
]

users =
  Enum.map(users_data, fn user_attrs ->
    {:ok, user} = Accounts.register_user(user_attrs)
    IO.puts("  ✓ #{user.name} (#{user.email})")
    user
  end)

[user1, user2, user3, user4, user5, user6, user7, user8] = users

IO.puts("✅ Created #{length(users)} users!")

# ==============================================================================
# TEAMS
# ==============================================================================
IO.puts("\n⚽ Creating teams...")

{:ok, team1} =
  Teams.create_team(user1, %{
    name: "Raça Tricolor",
    tag: "RACA",
    description: "Time de futsal competitivo de São Paulo",
    team_type: "primary"
  })

IO.puts("  ✓ #{team1.name} (Captain: #{user1.name})")

{:ok, team2} =
  Teams.create_team(user2, %{
    name: "Guerreiros FC",
    tag: "GUER",
    description: "Equipe focada em fair play e competição",
    team_type: "primary"
  })

IO.puts("  ✓ #{team2.name} (Captain: #{user2.name})")

{:ok, team3} =
  Teams.create_team(user5, %{
    name: "Relâmpago Azul",
    tag: "RELA",
    description: "Velocidade e técnica em campo",
    team_type: "primary"
  })

IO.puts("  ✓ #{team3.name} (Captain: #{user5.name})")

{:ok, team4} =
  Teams.create_team(user8, %{
    name: "Fúria Vermelha",
    tag: "FURI",
    description: "Paixão e garra em cada partida",
    team_type: "primary"
  })

IO.puts("  ✓ #{team4.name} (Captain: #{user8.name})")

# Add members to teams
Teams.add_member(team1, user3, "member")
Teams.add_member(team1, user4, "member")
Teams.add_member(team2, user6, "member")
Teams.add_member(team2, user7, "member")

IO.puts("✅ Created 4 teams with members!")

# ==============================================================================
# VENUES
# ==============================================================================
IO.puts("\n🏟️  Creating venues...")

venues_data = [
  %{
    name: "Arena Sports Center",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    lat: -23.550520,
    lng: -46.633308,
    opening_time: ~T[08:00:00],
    closing_time: ~T[22:00:00],
    hourly_rate: Decimal.new("150.00"),
    amenities: ["vestiario", "estacionamento", "lanchonete", "chuveiro"]
  },
  %{
    name: "Quadra do Parque",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    lat: -23.561414,
    lng: -46.656139,
    opening_time: ~T[07:00:00],
    closing_time: ~T[23:00:00],
    hourly_rate: Decimal.new("120.00"),
    amenities: ["vestiario", "estacionamento"]
  },
  %{
    name: "Complexo Esportivo Vila",
    address: "Rua da Vila, 456",
    city: "São Paulo",
    state: "SP",
    lat: -23.595050,
    lng: -46.688194,
    opening_time: ~T[06:00:00],
    closing_time: ~T[23:00:00],
    hourly_rate: Decimal.new("180.00"),
    amenities: ["vestiario", "estacionamento", "lanchonete", "churrasqueira", "wifi"]
  },
  %{
    name: "Centro Esportivo Morumbi",
    address: "Av. Morumbi, 789",
    city: "São Paulo",
    state: "SP",
    lat: -23.600000,
    lng: -46.700000,
    opening_time: ~T[08:00:00],
    closing_time: ~T[22:00:00],
    hourly_rate: Decimal.new("200.00"),
    amenities: ["vestiario", "estacionamento", "lanchonete", "academia"]
  },
  %{
    name: "Quadras Pinheiros",
    address: "Rua Pinheiros, 321",
    city: "São Paulo",
    state: "SP",
    lat: -23.565000,
    lng: -46.682000,
    opening_time: ~T[09:00:00],
    closing_time: ~T[21:00:00],
    hourly_rate: Decimal.new("140.00"),
    amenities: ["vestiario", "estacionamento"]
  }
]

venues =
  Enum.map(venues_data, fn venue_attrs ->
    {:ok, venue} = Venues.create_venue(venue_attrs)
    IO.puts("  ✓ #{venue.name} (#{venue.city})")
    venue
  end)

[venue1, venue2, venue3, venue4, venue5] = venues

IO.puts("✅ Created #{length(venues)} venues!")

# ==============================================================================
# FIELDS
# ==============================================================================
IO.puts("\n🏐 Creating fields...")

fields_data = [
  # Arena Sports Center
  {venue1,
   [
     %{
       name: "Quadra 1",
       sport_type: "futsal",
       surface: "madeira",
       player_capacity: 10,
       dimensions: "40x20m",
       is_covered: true
     },
     %{
       name: "Quadra 2",
       sport_type: "futsal",
       surface: "madeira",
       player_capacity: 10,
       dimensions: "40x20m",
       is_covered: true
     }
   ]},
  # Quadra do Parque
  {venue2,
   [
     %{
       name: "Campo Society",
       sport_type: "society",
       surface: "grama_sintetica",
       player_capacity: 14,
       dimensions: "60x40m",
       is_covered: false
     }
   ]},
  # Complexo Esportivo Vila
  {venue3,
   [
     %{
       name: "Quadra Coberta 1",
       sport_type: "futsal",
       surface: "piso_esportivo",
       player_capacity: 10,
       dimensions: "42x22m",
       is_covered: true
     },
     %{
       name: "Quadra Coberta 2",
       sport_type: "volei",
       surface: "madeira",
       player_capacity: 12,
       dimensions: "18x9m",
       is_covered: true
     },
     %{
       name: "Campo Externo",
       sport_type: "society",
       surface: "grama_sintetica",
       player_capacity: 14,
       dimensions: "60x40m",
       is_covered: false
     }
   ]},
  # Centro Esportivo Morumbi
  {venue4,
   [
     %{
       name: "Arena Principal",
       sport_type: "futsal",
       surface: "piso_esportivo",
       player_capacity: 12,
       dimensions: "42x22m",
       is_covered: true
     }
   ]},
  # Quadras Pinheiros
  {venue5,
   [
     %{
       name: "Quadra A",
       sport_type: "futsal",
       surface: "concreto",
       player_capacity: 10,
       dimensions: "40x20m",
       is_covered: false
     }
   ]}
]

field_count =
  Enum.reduce(fields_data, 0, fn {venue, fields}, acc ->
    Enum.each(fields, fn field_attrs ->
      {:ok, field} = Venues.create_field(venue, field_attrs)
      IO.puts("  ✓ #{venue.name} - #{field.name} (#{field.sport_type})")
    end)

    acc + length(fields)
  end)

IO.puts("✅ Created #{field_count} fields!")

# ==============================================================================
# LOBBIES
# ==============================================================================
IO.puts("\n🎮 Creating lobbies...")

today = Date.utc_today()

lobbies =
  Enum.map(venues, fn venue ->
    {:ok, lobby} = Matchmaking.get_or_create_lobby(venue, today)
    IO.puts("  ✓ Lobby for #{venue.name}")
    lobby
  end)

IO.puts("✅ Created #{length(lobbies)} lobbies!")

# ==============================================================================
# QUEUE TICKETS
# ==============================================================================
IO.puts("\n🎫 Adding teams to queues...")

[lobby1, lobby2, lobby3 | _] = lobbies

{:ok, _ticket1} =
  Matchmaking.join_queue(lobby1, team1,
    available_from: ~T[18:00:00],
    available_until: ~T[22:00:00]
  )

IO.puts("  ✓ #{team1.name} joined queue at #{venue1.name}")

{:ok, _ticket2} =
  Matchmaking.join_queue(lobby1, team2,
    available_from: ~T[19:00:00],
    available_until: ~T[23:00:00]
  )

IO.puts("  ✓ #{team2.name} joined queue at #{venue1.name}")

{:ok, _ticket3} =
  Matchmaking.join_queue(lobby2, team3,
    available_from: ~T[17:00:00],
    available_until: ~T[21:00:00]
  )

IO.puts("  ✓ #{team3.name} joined queue at #{venue2.name}")

IO.puts("✅ Teams added to queues!")

# ==============================================================================
# CHALLENGES
# ==============================================================================
IO.puts("\n⚔️  Creating challenges...")

proposed_time = DateTime.utc_now() |> DateTime.add(2, :day) |> DateTime.truncate(:second)

{:ok, challenge1} =
  Matchmaking.create_challenge(team1, team2, venue1, %{
    proposed_datetime: proposed_time,
    is_ranked: true,
    message: "Bora jogar um rachão?"
  })

IO.puts("  ✓ #{team1.name} challenged #{team2.name}")

{:ok, challenge2} =
  Matchmaking.create_challenge(team3, team4, venue3, %{
    proposed_datetime: proposed_time,
    is_ranked: true,
    message: "Aceita o desafio?"
  })

IO.puts("  ✓ #{team3.name} challenged #{team4.name}")

IO.puts("✅ Created 2 challenges!")

# ==============================================================================
# MATCHES (from accepted challenges)
# ==============================================================================
IO.puts("\n🏆 Creating matches from challenges...")

# Accept challenge and create match
{:ok, match1} = Matchmaking.accept_challenge(challenge1)
IO.puts("  ✓ Match created: #{team1.name} vs #{team2.name}")

# Simulate a finished match with scores
match1 = Repo.preload(match1, [:home_team, :away_team])

# Home team reports score
{:ok, match1} = Matchmaking.report_score(match1, :home, 5, 3)
IO.puts("  ✓ Home team reported: 5-3")

# Away team confirms (same score)
{:ok, match1} = Matchmaking.report_score(match1, :away, 5, 3)
IO.puts("  ✓ Away team confirmed: 5-3")
IO.puts("  ✓ Match finished! MMR updated automatically")

# Reload teams to see updated MMR
team1_updated = Teams.get_team!(team1.id)
team2_updated = Teams.get_team!(team2.id)

IO.puts("  📊 #{team1_updated.name}: MMR #{team1_updated.mmr} (#{team1_updated.rank_tier})")
IO.puts("  📊 #{team2_updated.name}: MMR #{team2_updated.mmr} (#{team2_updated.rank_tier})")

IO.puts("✅ Matches created and processed!")

# ==============================================================================
# SUMMARY
# ==============================================================================
IO.puts("\n" <> String.duplicate("=", 60))
IO.puts("🎉 DATABASE SEEDED SUCCESSFULLY!")
IO.puts(String.duplicate("=", 60))
IO.puts("\n📊 Summary:")
IO.puts("  • #{length(users)} users created")
IO.puts("  • 4 teams created")
IO.puts("  • #{length(venues)} venues created")
IO.puts("  • #{field_count} fields created")
IO.puts("  • #{length(lobbies)} lobbies created")
IO.puts("  • 3 teams in queues")
IO.puts("  • 2 challenges created")
IO.puts("  • 1 match finished with MMR calculation")

IO.puts("\n🔑 Test Credentials:")
IO.puts("  Email: joao@quadras.com | Password: senha123")
IO.puts("  Email: maria@quadras.com | Password: senha123")
IO.puts("  Email: carlos@quadras.com | Password: senha123")

IO.puts("\n🚀 You can now test the API!")
IO.puts("  • Login with any user above")
IO.puts("  • Check teams and their MMR")
IO.puts("  • Search nearby venues")
IO.puts("  • View active lobbies and queues")
IO.puts("  • Accept pending challenges")
IO.puts(String.duplicate("=", 60) <> "\n")
