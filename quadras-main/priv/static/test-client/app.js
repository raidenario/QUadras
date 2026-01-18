/**
 * Quadras API Tester - JavaScript Client
 * Handles all API interactions and UI logic
 */

// ============================================
// Configuration & State
// ============================================
let config = {
    apiUrl: localStorage.getItem('apiUrl') || 'http://localhost:4000',
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation
    setupNavigation();
    setupTabs();

    // Load saved config
    document.getElementById('apiUrl').value = config.apiUrl;

    // Update auth status
    updateAuthStatus();

    // Log startup
    logToConsole('info', `🚀 Quadras API Tester inicializado`);
    logToConsole('info', `📡 API URL: ${config.apiUrl}`);

    if (config.token) {
        logToConsole('success', `✅ Token encontrado - usuário autenticado`);
    }
});

// ============================================
// Navigation
// ============================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show corresponding section
            const sectionId = link.dataset.section;
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            const parent = btn.closest('.section');

            // Update active tab button
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding tab content
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            parent.querySelector(`#${tab}`).classList.add('active');
        });
    });
}

// ============================================
// HTTP Client
// ============================================
async function apiRequest(method, endpoint, data = null, requiresAuth = true) {
    const url = `${config.apiUrl}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (requiresAuth && config.token) {
        options.headers['Authorization'] = `Bearer ${config.token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    // Log request
    logToConsole('request', `${method} ${endpoint}`, data);

    try {
        const response = await fetch(url, options);
        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            logToConsole('error', `${response.status} ${response.statusText}`, responseData);
            throw { status: response.status, data: responseData };
        }

        logToConsole('response', `${response.status} OK`, responseData);
        return responseData;

    } catch (error) {
        if (error.status) throw error;

        logToConsole('error', `Network Error: ${error.message}`);
        throw { status: 0, data: { error: error.message } };
    }
}

// ============================================
// Console Logging
// ============================================
function logToConsole(type, message, data = null) {
    const console = document.getElementById('consoleOutput');
    const timestamp = new Date().toLocaleTimeString();

    let typeClass = '';
    switch (type) {
        case 'request': typeClass = 'request'; break;
        case 'response': typeClass = 'response'; break;
        case 'error': typeClass = 'error'; break;
        case 'success': typeClass = 'response'; break;
        default: typeClass = '';
    }

    let html = `<div class="console-line ${typeClass}">`;
    html += `<span class="timestamp">[${timestamp}]</span>`;
    html += `<span>${message}</span>`;

    if (data) {
        html += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    html += `</div>`;

    console.innerHTML += html;
    console.scrollTop = console.scrollHeight;
}

function clearConsole() {
    document.getElementById('consoleOutput').innerHTML = '';
    logToConsole('info', '🗑️ Console limpo');
}

// ============================================
// Configuration Functions
// ============================================
function saveConfig() {
    const url = document.getElementById('apiUrl').value.trim().replace(/\/$/, '');
    config.apiUrl = url;
    localStorage.setItem('apiUrl', url);
    logToConsole('success', `✅ Configuração salva: ${url}`);
    showToast('Configuração salva!', 'success');
}

async function testConnection() {
    try {
        await apiRequest('GET', '/api/health', null, false);
        logToConsole('success', '✅ Conexão com a API OK!');
        showToast('Conexão OK!', 'success');
    } catch (error) {
        logToConsole('error', '❌ Falha na conexão com a API');
        showToast('Falha na conexão', 'error');
    }
}

// ============================================
// Auth Functions
// ============================================
function updateAuthStatus() {
    const statusEl = document.getElementById('authStatus');
    const dot = statusEl.querySelector('.status-dot');
    const text = statusEl.querySelector('.status-text');

    if (config.token && config.user) {
        dot.classList.remove('offline');
        dot.classList.add('online');
        text.textContent = config.user.name || config.user.email;
    } else {
        dot.classList.remove('online');
        dot.classList.add('offline');
        text.textContent = 'Não autenticado';
    }
}

async function register() {
    const data = {
        user: {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            phone: document.getElementById('regPhone').value,
            preferred_position: document.getElementById('regPosition').value,
            dominant_foot: document.getElementById('regFoot').value
        }
    };

    try {
        const result = await apiRequest('POST', '/api/v1/auth/register', data, false);

        config.token = result.data.token;
        config.user = result.data.user;
        localStorage.setItem('token', config.token);
        localStorage.setItem('user', JSON.stringify(config.user));

        updateAuthStatus();
        showToast('Registro realizado com sucesso!', 'success');

    } catch (error) {
        showToast('Erro no registro: ' + JSON.stringify(error.data), 'error');
    }
}

async function login() {
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const result = await apiRequest('POST', '/api/v1/auth/login', data, false);

        config.token = result.data.token;
        config.user = result.data.user;
        localStorage.setItem('token', config.token);
        localStorage.setItem('user', JSON.stringify(config.user));

        updateAuthStatus();
        showToast('Login realizado com sucesso!', 'success');

    } catch (error) {
        showToast('Erro no login', 'error');
    }
}

async function getMe() {
    try {
        const result = await apiRequest('GET', '/api/v1/auth/me');
        displayData('profileData', result);
    } catch (error) {
        showToast('Erro ao carregar perfil', 'error');
    }
}

async function logout() {
    try {
        await apiRequest('DELETE', '/api/v1/auth/logout');
    } catch (e) {
        // Ignore logout errors
    }

    config.token = null;
    config.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    updateAuthStatus();
    showToast('Logout realizado', 'success');
}

async function updateLocation() {
    const data = {
        latitude: parseFloat(document.getElementById('locLat').value),
        longitude: parseFloat(document.getElementById('locLng').value)
    };

    try {
        const result = await apiRequest('PUT', '/api/v1/auth/location', data);
        displayData('profileData', result);
        showToast('Localização atualizada!', 'success');
    } catch (error) {
        showToast('Erro ao atualizar localização', 'error');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('locLat').value = position.coords.latitude;
                document.getElementById('locLng').value = position.coords.longitude;
                logToConsole('success', `📍 Localização obtida: ${position.coords.latitude}, ${position.coords.longitude}`);
            },
            (error) => {
                logToConsole('error', `❌ Erro ao obter localização: ${error.message}`);
            }
        );
    } else {
        logToConsole('error', '❌ Geolocalização não suportada');
    }
}

// ============================================
// Team Functions
// ============================================
async function listTeams() {
    const search = document.getElementById('teamsSearch').value;
    const rank = document.getElementById('teamsRank').value;

    let endpoint = '/api/v1/teams';
    const params = [];
    if (search) params.push(`q=${encodeURIComponent(search)}`);
    if (rank) params.push(`rank_tier=${rank}`);
    if (params.length) endpoint += '?' + params.join('&');

    try {
        const result = await apiRequest('GET', endpoint, null, false);
        displayData('teamsListData', result);
    } catch (error) {
        showToast('Erro ao listar times', 'error');
    }
}

async function getTeam() {
    const id = document.getElementById('teamId').value;
    if (!id) {
        showToast('Informe o ID do time', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/teams/${id}`, null, false);
        displayData('teamsListData', result);
    } catch (error) {
        showToast('Time não encontrado', 'error');
    }
}

async function getMyTeam() {
    try {
        const result = await apiRequest('GET', '/api/v1/teams/me');
        displayData('myTeamsData', result);
    } catch (error) {
        showToast('Você não tem um time principal', 'error');
    }
}

async function getAllMyTeams() {
    try {
        const result = await apiRequest('GET', '/api/v1/teams/my-teams');
        displayData('myTeamsData', result);
    } catch (error) {
        showToast('Erro ao buscar seus times', 'error');
    }
}

async function createTeam() {
    const data = {
        team: {
            name: document.getElementById('teamName').value,
            tag: document.getElementById('teamTag').value.toUpperCase(),
            description: document.getElementById('teamDescription').value,
            team_type: document.getElementById('teamType').value
        }
    };

    try {
        const result = await apiRequest('POST', '/api/v1/teams', data);
        displayData('myTeamsData', result);
        showToast('Time criado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao criar time', 'error');
    }
}

async function addMember() {
    const teamId = document.getElementById('memberTeamId').value;
    const userId = document.getElementById('memberUserId').value;

    if (!teamId || !userId) {
        showToast('Informe Team ID e User ID', 'error');
        return;
    }

    try {
        await apiRequest('POST', `/api/v1/teams/${teamId}/members`, { user_id: userId });
        showToast('Membro adicionado!', 'success');
    } catch (error) {
        showToast('Erro ao adicionar membro', 'error');
    }
}

async function removeMember() {
    const teamId = document.getElementById('memberTeamId').value;
    const userId = document.getElementById('memberUserId').value;

    if (!teamId || !userId) {
        showToast('Informe Team ID e User ID', 'error');
        return;
    }

    try {
        await apiRequest('DELETE', `/api/v1/teams/${teamId}/members/${userId}`);
        showToast('Membro removido!', 'success');
    } catch (error) {
        showToast('Erro ao remover membro', 'error');
    }
}

// ============================================
// Venue Functions
// ============================================
async function listVenues() {
    const city = document.getElementById('venueCity').value;
    const sport = document.getElementById('venueSport').value;

    let endpoint = '/api/v1/venues';
    const params = [];
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    if (sport) params.push(`sport_type=${sport}`);
    if (params.length) endpoint += '?' + params.join('&');

    try {
        const result = await apiRequest('GET', endpoint, null, false);
        displayData('venuesListData', result);
    } catch (error) {
        showToast('Erro ao listar venues', 'error');
    }
}

async function getVenue() {
    const id = document.getElementById('venueShowId').value;
    if (!id) {
        showToast('Informe o ID do venue', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/venues/${id}`, null, false);
        displayData('venuesListData', result);
    } catch (error) {
        showToast('Venue não encontrado', 'error');
    }
}

async function getVenueFields() {
    const id = document.getElementById('venueShowId').value;
    if (!id) {
        showToast('Informe o ID do venue', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/venues/${id}/fields`, null, false);
        displayData('venuesListData', result);
    } catch (error) {
        showToast('Erro ao buscar campos', 'error');
    }
}

async function findNearbyVenues() {
    const lat = document.getElementById('nearbyLat').value;
    const lng = document.getElementById('nearbyLng').value;
    const radius = document.getElementById('nearbyRadius').value;

    if (!lat || !lng) {
        showToast('Informe latitude e longitude', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/venues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, null, false);
        displayData('nearbyVenuesData', result);
    } catch (error) {
        showToast('Erro ao buscar venues próximos', 'error');
    }
}

function useCurrentLocationForNearby() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('nearbyLat').value = position.coords.latitude;
                document.getElementById('nearbyLng').value = position.coords.longitude;
                logToConsole('success', `📍 Localização obtida`);
            },
            (error) => {
                logToConsole('error', `❌ Erro: ${error.message}`);
            }
        );
    }
}

async function createVenue() {
    const data = {
        venue: {
            name: document.getElementById('newVenueName').value,
            address: document.getElementById('newVenueAddress').value,
            city: document.getElementById('newVenueCity').value,
            state: document.getElementById('newVenueState').value,
            lat: parseFloat(document.getElementById('newVenueLat').value),
            lng: parseFloat(document.getElementById('newVenueLng').value),
            opening_time: document.getElementById('newVenueOpen').value + ':00',
            closing_time: document.getElementById('newVenueClose').value + ':00',
            hourly_rate: document.getElementById('newVenueRate').value
        }
    };

    try {
        const result = await apiRequest('POST', '/api/v1/venues', data);
        displayData('venuesListData', result);
        showToast('Quadra criada com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao criar quadra', 'error');
    }
}

async function createField() {
    const venueId = document.getElementById('fieldVenueId').value;
    if (!venueId) {
        showToast('Informe o ID da Quadra', 'error');
        return;
    }

    const data = {
        field: {
            name: document.getElementById('fieldName').value,
            sport_type: document.getElementById('fieldSport').value,
            surface: document.getElementById('fieldSurface').value,
            player_capacity: parseInt(document.getElementById('fieldCapacity').value),
            slot_duration_minutes: parseInt(document.getElementById('fieldSlotDuration').value),
            is_covered: document.getElementById('fieldCovered').value === 'true'
        }
    };

    try {
        const result = await apiRequest('POST', `/api/v1/venues/${venueId}/fields`, data);
        displayData('fieldCreateData', result);
        showToast('Campo criado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao criar campo', 'error');
    }
}

// ============================================
// Lobby/Queue Functions
// ============================================
async function showLobby() {
    const venueId = document.getElementById('lobbyVenueId').value;
    if (!venueId) {
        showToast('Informe o Venue ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/venues/${venueId}/lobby`, null, false);
        displayData('lobbyData', result);
    } catch (error) {
        showToast('Erro ao carregar lobby', 'error');
    }
}

async function joinQueue() {
    const venueId = document.getElementById('queueVenueId').value;
    const teamId = document.getElementById('queueTeamId').value;
    const from = document.getElementById('queueFrom').value;
    const until = document.getElementById('queueUntil').value;

    if (!venueId || !teamId) {
        showToast('Informe Venue ID e Team ID', 'error');
        return;
    }

    const data = {
        team_id: teamId,
        available_from: from + ':00',
        available_until: until + ':00'
    };

    try {
        const result = await apiRequest('POST', `/api/v1/venues/${venueId}/lobby/join`, data);
        displayData('lobbyData', result);
        showToast('Entrou na fila!', 'success');
    } catch (error) {
        showToast('Erro ao entrar na fila', 'error');
    }
}

async function leaveQueue() {
    const venueId = document.getElementById('queueVenueId').value;
    const teamId = document.getElementById('queueTeamId').value;

    if (!venueId || !teamId) {
        showToast('Informe Venue ID e Team ID', 'error');
        return;
    }

    try {
        await apiRequest('DELETE', `/api/v1/venues/${venueId}/lobby/leave?team_id=${teamId}`);
        showToast('Saiu da fila!', 'success');
    } catch (error) {
        showToast('Erro ao sair da fila', 'error');
    }
}

// ============================================
// Challenge Functions
// ============================================
async function listChallenges() {
    const teamId = document.getElementById('challengesTeamId').value;
    if (!teamId) {
        showToast('Informe o Team ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/challenges?team_id=${teamId}`);
        displayData('challengesData', result);
    } catch (error) {
        showToast('Erro ao listar desafios', 'error');
    }
}

async function createChallenge() {
    const challengerTeamId = document.getElementById('challengerTeamId').value;
    const challengedTeamId = document.getElementById('challengedTeamId').value;
    const venueId = document.getElementById('challengeVenueId').value;
    const datetime = document.getElementById('challengeDatetime').value;
    const message = document.getElementById('challengeMessage').value;
    const isRanked = document.getElementById('challengeRanked').checked;

    if (!challengerTeamId || !challengedTeamId || !venueId || !datetime) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    const data = {
        challenge: {
            challenger_team_id: challengerTeamId,
            challenged_team_id: challengedTeamId,
            venue_id: venueId,
            proposed_datetime: new Date(datetime).toISOString(),
            message: message,
            is_ranked: isRanked
        }
    };

    try {
        const result = await apiRequest('POST', '/api/v1/challenges', data);
        displayData('challengesData', result);
        showToast('Desafio criado!', 'success');
    } catch (error) {
        showToast('Erro ao criar desafio', 'error');
    }
}

async function acceptChallenge() {
    const id = document.getElementById('actionChallengeId').value;
    if (!id) {
        showToast('Informe o Challenge ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('POST', `/api/v1/challenges/${id}/accept`);
        displayData('challengesData', result);
        showToast('Desafio aceito! Partida criada.', 'success');
    } catch (error) {
        showToast('Erro ao aceitar desafio', 'error');
    }
}

async function rejectChallenge() {
    const id = document.getElementById('actionChallengeId').value;
    if (!id) {
        showToast('Informe o Challenge ID', 'error');
        return;
    }

    try {
        await apiRequest('POST', `/api/v1/challenges/${id}/reject`);
        showToast('Desafio rejeitado', 'success');
    } catch (error) {
        showToast('Erro ao rejeitar desafio', 'error');
    }
}

// ============================================
// Match Functions
// ============================================
async function showMatch() {
    const id = document.getElementById('matchId').value;
    if (!id) {
        showToast('Informe o Match ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/matches/${id}`, null, false);
        displayData('matchData', result);
    } catch (error) {
        showToast('Partida não encontrada', 'error');
    }
}

async function listTeamMatches() {
    const teamId = document.getElementById('matchesTeamId').value;
    const status = document.getElementById('matchesStatus').value;

    if (!teamId) {
        showToast('Informe o Team ID', 'error');
        return;
    }

    let endpoint = `/api/v1/teams/${teamId}/matches`;
    if (status) endpoint += `?status=${status}`;

    try {
        const result = await apiRequest('GET', endpoint, null, false);
        displayData('teamMatchesData', result);
    } catch (error) {
        showToast('Erro ao listar partidas', 'error');
    }
}

async function reportScore() {
    const matchId = document.getElementById('scoreMatchId').value;
    const homeScore = parseInt(document.getElementById('homeScore').value);
    const awayScore = parseInt(document.getElementById('awayScore').value);
    const side = document.getElementById('scoreSide').value;

    if (!matchId) {
        showToast('Informe o Match ID', 'error');
        return;
    }

    const data = {
        home_score: homeScore,
        away_score: awayScore,
        side: side
    };

    try {
        const result = await apiRequest('POST', `/api/v1/matches/${matchId}/score`, data);
        displayData('matchData', result);
        showToast('Placar reportado!', 'success');
    } catch (error) {
        showToast('Erro ao reportar placar', 'error');
    }
}

async function confirmScore() {
    const matchId = document.getElementById('scoreMatchId').value;
    const side = document.getElementById('scoreSide').value;

    if (!matchId) {
        showToast('Informe o Match ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('POST', `/api/v1/matches/${matchId}/confirm`, { side });
        displayData('matchData', result);
        showToast('Placar confirmado!', 'success');
    } catch (error) {
        showToast('Erro ao confirmar placar', 'error');
    }
}

async function disputeScore() {
    const matchId = document.getElementById('scoreMatchId').value;

    if (!matchId) {
        showToast('Informe o Match ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('POST', `/api/v1/matches/${matchId}/dispute`);
        displayData('matchData', result);
        showToast('Disputa aberta!', 'success');
    } catch (error) {
        showToast('Erro ao abrir disputa', 'error');
    }
}

// ============================================
// Scheduling Functions
// ============================================
async function listSlots() {
    const fieldId = document.getElementById('slotFieldId').value;
    const date = document.getElementById('slotDate').value;

    if (!fieldId || !date) {
        showToast('Informe Field ID e Data', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/fields/${fieldId}/slots?date=${date}`, null, false);
        displayData('slotsData', result);
    } catch (error) {
        showToast('Erro ao listar slots', 'error');
    }
}

async function bookSlot() {
    const fieldId = document.getElementById('bookFieldId').value;
    const teamId = document.getElementById('bookTeamId').value;
    const slotStart = document.getElementById('bookSlotStart').value;
    const isRanked = document.getElementById('bookRanked').value === 'true';

    if (!fieldId || !teamId || !slotStart) {
        showToast('Preencha todos os campos', 'error');
        return;
    }

    // Convert datetime-local to ISO8601
    const slotStartISO = new Date(slotStart).toISOString();

    const data = {
        team_id: teamId,
        slot_start: slotStartISO,
        is_ranked: isRanked
    };

    try {
        const result = await apiRequest('POST', `/api/v1/fields/${fieldId}/book`, data);
        displayData('slotsData', result);
        showToast('Slot reservado! Aguardando adversário.', 'success');
    } catch (error) {
        showToast('Erro ao reservar slot', 'error');
    }
}

async function joinOpenMatch() {
    const matchId = document.getElementById('joinMatchId').value;
    const teamId = document.getElementById('joinTeamId').value;

    if (!matchId || !teamId) {
        showToast('Informe Match ID e Team ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('POST', `/api/v1/matches/${matchId}/join`, { team_id: teamId });
        displayData('slotsData', result);
        showToast('Entrou na partida! Jogo confirmado.', 'success');
    } catch (error) {
        showToast('Erro ao entrar na partida', 'error');
    }
}

async function listOpenMatches() {
    const venueId = document.getElementById('openMatchesVenueId').value;

    if (!venueId) {
        showToast('Informe o Venue ID', 'error');
        return;
    }

    try {
        const result = await apiRequest('GET', `/api/v1/venues/${venueId}/open-matches`, null, false);
        displayData('openMatchesData', result);
    } catch (error) {
        showToast('Erro ao listar partidas abertas', 'error');
    }
}

// ============================================
// Utility Functions
// ============================================
function displayData(elementId, data) {
    const el = document.getElementById(elementId);
    el.innerHTML = JSON.stringify(data, null, 2);
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
