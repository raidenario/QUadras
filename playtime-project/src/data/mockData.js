/**
 * 📊 DADOS MOCKADOS (DE EXEMPLO)
 * 
 * Este arquivo contém dados falsos para testar o app.
 * No futuro, esses dados virão de uma API/banco de dados.
 * 
 * CONCEITO: "Mock" significa "simulação". Estamos simulando
 * dados que viriam de um servidor real.
 */

/**
 * PARTIDAS (JOGOS)
 */
export const matches = [
    // Última partida (já aconteceu)
    {
        id: '1',
        type: 'past', // 'past' = passado, 'upcoming' = futuro
        sport: 'football', // 'football' ou 'volleyball'
        team1: {
            name: 'Falcões Dourados',
            logo: '🦅', // Emoji temporário (depois pode ser imagem)
            score: 2,
        },
        team2: {
            name: 'Dragões Azuis',
            logo: '🐉',
            score: 1,
        },
        date: '2026-01-17',
        time: '19:00',
        court: {
            name: 'Quadra Poliespestiva Central',
            address: 'Rua do Esporte, 123',
        },
        status: 'finished', // 'finished', 'live', 'scheduled', 'waiting'
    },

    // Próximas partidas
    {
        id: '2',
        type: 'upcoming',
        sport: 'football',
        team1: {
            name: 'Leões do Campo',
            logo: '🦁',
            score: null, // null porque ainda não jogou
        },
        team2: {
            name: 'Tigres FC',
            logo: '🐯',
            score: null,
        },
        date: '2026-01-18',
        time: '15:00',
        court: {
            name: 'Arena Central',
            address: 'Av. Principal, 456',
        },
        status: 'waiting',
        players: {
            current: 15,
            max: 20,
        },
    },

    {
        id: '3',
        type: 'upcoming',
        sport: 'volleyball',
        team1: {
            name: 'Águias Vôlei',
            logo: '🦅',
            score: null,
        },
        team2: {
            name: 'Tubarões',
            logo: '🦈',
            score: null,
        },
        date: '2026-01-19',
        time: '18:30',
        court: {
            name: 'Quadra Coberta Norte',
            address: 'Rua das Flores, 789',
        },
        status: 'waiting',
        players: {
            current: 8,
            max: 12,
        },
    },
];

/**
 * TIMES
 */
export const teams = [
    {
        id: '1',
        position: 1,
        name: 'Thunder FC',
        logo: '⚡', // Usando emoji similar
        city: 'São Carlos',
        state: 'SP',
        country: 'Brasil',
        points: 1663,
        trend: 'same', // 'up', 'down', 'same'
        wins: 43,
        losses: 3,
        draws: 0,
        members: { current: 15, max: 20 },
    },
    {
        id: '2',
        position: 2,
        name: 'Rocket Team',
        logo: '🚀',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        points: 1602,
        trend: 'up',
        wins: 36,
        losses: 5,
        draws: 0,
        members: { current: 18, max: 20 },
    },
    {
        id: '3',
        position: 3,
        name: 'Fúria FC',
        logo: '🔥',
        city: 'São José do Rio Preto',
        state: 'SP',
        country: 'Brasil',
        points: 1572,
        trend: 'down',
        wins: 34,
        losses: 10,
        draws: 2,
        members: { current: 12, max: 15 },
    },
    {
        id: '4',
        position: 4,
        name: 'Golden Lions',
        logo: '🦁',
        city: 'Ribeirão Preto',
        state: 'SP',
        country: 'Brasil',
        points: 1508,
        trend: 'same',
        wins: 32,
        losses: 11,
        draws: 1,
        members: { current: 20, max: 20 },
    },
    {
        id: '5',
        position: 5,
        name: 'Águias Douradas',
        logo: '🦅',
        city: 'Araraquara',
        state: 'SP',
        country: 'Brasil',
        points: 1480,
        trend: 'up',
        wins: 38,
        losses: 11,
        draws: 0,
        members: { current: 10, max: 12 },
    },
    {
        id: '6',
        position: 6,
        name: 'Tubarões Azuis',
        logo: '🦈',
        city: 'Campinas',
        state: 'SP',
        country: 'Brasil',
        points: 1467,
        trend: 'down',
        wins: 36,
        losses: 17,
        draws: 0,
        members: { current: 22, max: 25 },
    },
];

/**
 * QUADRAS
 */
export const courts = [
    {
        id: '1',
        name: 'Quadra Poliespestiva Central',
        address: 'Rua do Esporte, 123',
        image: '🏟️', // Emoji temporário
        sports: ['football', 'volleyball', 'basketball'],
        pricePerHour: 80,
        available: true,
        rating: 4.8,
        amenities: ['Vestiário', 'Estacionamento', 'Iluminação'],
    },
    {
        id: '2',
        name: 'Arena Central',
        address: 'Av. Principal, 456',
        image: '⚽',
        sports: ['football'],
        pricePerHour: 100,
        available: true,
        rating: 4.9,
        amenities: ['Vestiário', 'Estacionamento', 'Iluminação', 'Cantina'],
    },
    {
        id: '3',
        name: 'Quadra Coberta Norte',
        address: 'Rua das Flores, 789',
        image: '🏐',
        sports: ['volleyball'],
        pricePerHour: 60,
        available: false,
        rating: 4.5,
        amenities: ['Vestiário', 'Cobertura'],
    },
];

/**
 * USUÁRIO (exemplo de usuário logado)
 */
export const currentUser = {
    id: '1',
    firstName: 'João Pedro',
    surname: 'dos Anjos Oliveira Hornos',
    name: 'João Pedro dos Anjos Oliveira Hornos', // Mantendo para compatibilidade
    nickname: 'Raidenario',
    email: 'joaopedrohornos@gmail.com',
    city: 'São Carlos',
    state: 'SP',
    country: 'Brasil',
    avatar: require('../../assets/hornos-avatar.jpg'), // Usuário pediu 'hornos-avatar.jfif' (renomeado para .jpg)
    isLoggedIn: false,
    stats: {
        matchesPlayed: 45,
        wins: 28,
        losses: 12,
        draws: 5,
    },
    teams: ['1', '2'],
    favoriteTeams: [
        { id: '1', name: 'Thunder FC', badge: '⚡' },
        { id: '3', name: 'Fúria FC', badge: '🔥' }
    ],
    favoriteGames: [
        { id: '1', name: 'Futebol' },
        { id: '3', name: 'Vôlei' }
    ],
    favoritePlayers: [
        { id: '10', name: 'Neymar Jr', avatar: '🇧🇷' },
        { id: '7', name: 'Cristiano Ronaldo', avatar: '🇵🇹' },
        { id: '100', name: 'Messi', avatar: '🇦🇷' }
    ]
};

// Listas de Opções Disponíveis para Seleção
export const availableTeams = [
    { id: '1', name: 'Thunder FC', badge: '⚡' },
    { id: '2', name: 'Rocket Team', badge: '🚀' },
    { id: '3', name: 'Fúria FC', badge: '🔥' },
    { id: '4', name: 'Golden Lions', badge: '🦁' },
    { id: '5', name: 'Águias Douradas', badge: '🦅' },
    { id: '6', name: 'Tubarões Azuis', badge: '🦈' },
    { id: '7', name: 'Dragões Vermelhos', badge: '🐉' },
    { id: '8', name: 'Lobos da Noite', badge: '🐺' },
];

export const availableGames = [
    { id: '1', name: 'Futebol' },
    { id: '2', name: 'Basquete' },
    { id: '3', name: 'Vôlei' },
    { id: '4', name: 'Tênis' },
    { id: '5', name: 'Futsal' },
    { id: '6', name: 'Handebol' },
    { id: '7', name: 'Beach Tennis' },
    { id: '8', name: 'Futevôlei' },
];

export const availablePlayers = [
    { id: '10', name: 'Neymar Jr', avatar: '🇧🇷' },
    { id: '7', name: 'Cristiano Ronaldo', avatar: '🇵🇹' },
    { id: '100', name: 'Messi', avatar: '🇦🇷' },
    { id: '9', name: 'Ronaldo Fenômeno', avatar: '🇧🇷' },
    { id: '101', name: 'Mbappé', avatar: '🇫🇷' },
    { id: '102', name: 'Haaland', avatar: '🇳🇴' },
    { id: '103', name: 'Vinícius Jr', avatar: '🇧🇷' },
    { id: '104', name: 'De Bruyne', avatar: '🇧🇪' },
];

/**
 * NOTIFICAÇÕES
 */
export const notifications = [
    {
        id: '1',
        type: 'match', // 'match', 'team', 'system'
        title: 'Nova partida agendada!',
        message: 'Leões do Campo vs Tigres FC - Amanhã às 15h',
        date: '2026-01-17T10:30:00',
        read: false,
    },
    {
        id: '2',
        type: 'team',
        title: 'Novo membro no time',
        message: 'Maria entrou no time Águias Vôlei',
        date: '2026-01-16T14:20:00',
        read: false,
    },
    {
        id: '3',
        type: 'system',
        title: 'Bem-vindo ao Playtime!',
        message: 'Configure seu perfil para começar',
        date: '2026-01-15T09:00:00',
        read: true,
    },
];

/**
 * RANKING (RANKING DE JOGADORES ESTILO FIFA)
 */
export const ranking = [
    {
        id: '1',
        position: 1,
        firstName: 'João Pedro',
        surname: 'Hornos',
        nickname: 'Raidenario',
        avatar: require('../../assets/hornos-avatar.jpg'), // Avatar real
        city: 'São Carlos',
        state: 'SP',
        country: 'Brasil',
        currentTeams: ['Thunder FC', 'Rocket Team'],
        favoriteTeams: [{ name: 'Thunder FC', badge: '⚡' }, { name: 'Fúria FC', badge: '🔥' }],
        favoritePlayers: [{ name: 'Neymar Jr', avatar: '🇧🇷' }, { name: 'Messi', avatar: '🇦🇷' }],
        favoriteGames: [{ name: 'Futebol' }, { name: 'Vôlei' }],
        points: 1350,
        matchesPlayed: 52,
        wins: 45,
        losses: 3,
        draws: 4,
        goals: 60,
    },
    {
        id: '2',
        position: 2,
        firstName: 'Ana',
        surname: 'Paula Souza',
        nickname: 'Paulinha',
        avatar: '🥈',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        currentTeams: ['Águias Douradas'],
        favoriteTeams: [{ name: 'Águias Douradas', badge: '🦅' }],
        favoritePlayers: [{ name: 'Marta', avatar: '🇧🇷' }],
        favoriteGames: [{ name: 'Futebol' }, { name: 'Handebol' }],
        points: 1180,
        matchesPlayed: 48,
        wins: 36,
        losses: 8,
        draws: 4,
        goals: 32,
    },
    {
        id: '3',
        position: 3,
        firstName: 'Roberto',
        surname: 'Firmino Oliveira',
        nickname: 'Beto',
        avatar: '🥉',
        city: 'Campinas',
        state: 'SP',
        country: 'Brasil',
        currentTeams: ['Tubarões Azuis', 'Dragões Vermelhos'],
        favoriteTeams: [{ name: 'Tubarões Azuis', badge: '🦈' }],
        favoritePlayers: [{ name: 'Cristiano Ronaldo', avatar: '🇵🇹' }],
        favoriteGames: [{ name: 'Futsal' }],
        points: 1100,
        matchesPlayed: 45,
        wins: 33,
        losses: 10,
        draws: 2,
        goals: 28,
    },
    {
        id: '4',
        position: 4,
        firstName: 'Lucas',
        surname: 'Lima Ferreira',
        nickname: 'Luquinhas',
        avatar: '👤',
        points: 950,
        matchesPlayed: 40,
        wins: 25,
        losses: 10,
        draws: 5,
        goals: 15,
    },
    {
        id: '5',
        position: 5,
        firstName: 'Mariana',
        surname: 'Costa e Silva',
        nickname: 'Mari',
        avatar: '👤',
        points: 880,
        matchesPlayed: 38,
        wins: 20,
        losses: 15,
        draws: 3,
        goals: 10,
    },
    {
        id: '6',
        position: 6,
        firstName: 'Felipe',
        surname: 'Santos',
        nickname: 'Felipão',
        avatar: '👤',
        points: 820,
        matchesPlayed: 35,
        wins: 18,
        losses: 12,
        draws: 5,
        goals: 12,
    },
    {
        id: '7',
        position: 7,
        firstName: 'Gabriela',
        surname: 'Rocha',
        nickname: 'Gabi',
        avatar: '👤',
        points: 750,
        matchesPlayed: 30,
        wins: 15,
        losses: 10,
        draws: 5,
        goals: 8,
    },
    {
        id: '8',
        position: 8,
        firstName: 'Rafael',
        surname: 'Moura',
        nickname: 'Rafa',
        avatar: '👤',
        points: 700,
        matchesPlayed: 28,
        wins: 12,
        losses: 10,
        draws: 6,
        goals: 5,
    },
];

/**
 * MEUS TIMES
 */
export const myTeams = [
    {
        id: 'mt1',
        name: 'Os Invencíveis',
        logo: '🚀', // Emoji por enquanto
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        members: 12,
        matches: 5,
        wins: 4,
    },
    {
        id: 'mt2',
        name: 'Futebol de Domingo',
        logo: '⚽',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
        members: 20,
        matches: 10,
        wins: 6,
    }
];

/**
 * FAQ DE PONTUAÇÃO
 */
export const scoringFAQ = [
    {
        id: '1',
        question: 'Como funciona o sistema de pontos?',
        answer: 'O sistema utiliza um algoritmo baseado no ELO. Você ganha pontos ao vencer partidas e perde ao ser derrotado. A quantidade depende da força do adversário.'
    },
    {
        id: '2',
        question: 'Quantos pontos ganho por vitória?',
        answer: 'Em média, uma vitória rende entre 15 e 30 pontos. Se vencer um time muito mais forte, ganha mais pontos. Se vencer um mais fraco, ganha menos.'
    },
    {
        id: '3',
        question: 'Gols e assistências contam?',
        answer: 'Sim! Além do resultado da partida, sua performance individual (gols, assistências, defesa) contribui para uma pontuação bônus separada.'
    },
    {
        id: '4',
        question: 'O que é o "Tier"?',
        answer: 'Os jogadores são divididos em Tiers (Bronze, Prata, Ouro, etc) baseados na pontuação total. Suba de Tier para ganhar medalhas exclusivas.'
    },
    {
        id: '5',
        question: 'A pontuação reseta?',
        answer: 'A pontuação é resetada parcialmente a cada temporada (trimestralmente) para manter a competitividade.'
    }
];

/**
 * COMO USAR ESSES DADOS:
 * 
 * import { matches, teams, courts } from './data/mockData';
 * 
 * function MinhaScreen() {
 *   return (
 *     <View>
 *       {matches.map(match => (
 *         <Text key={match.id}>{match.team1.name}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 */
