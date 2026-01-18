/**
 * 🏠 TELA INICIAL (HOME SCREEN)
 * 
 * Tela principal do app que mostra:
 * - Última partida que aconteceu
 * - Próximas 2 partidas
 * - Seção de times com botão "Criar Time"
 * - Seção de quadras com botão "Ver Detalhes"
 * 
 * CONCEITO: ScrollView permite rolar a tela quando o conteúdo
 * é maior que a altura da tela.
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import SearchBar from '../components/SearchBar';
import MatchCard from '../components/MatchCard';
import TeamCard from '../components/TeamCard';
import CourtCard from '../components/CourtCard';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    const [teams, setTeams] = useState([]);
    const [courts, setCourts] = useState([]);
    const [matches, setMatches] = useState([]); // Ainda mockado ou vazio por enquanto

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsRes, venuesRes] = await Promise.all([
                    api.get('/teams'),
                    api.get('/venues')
                ]);

                setTeams(teamsRes.data.data || []);
                setCourts(venuesRes.data.data || []);
                // Para matches, manteremos vazio ou mockado se não houver endpoint global
            } catch (error) {
                console.log("Error loading home data", error);
            }
        };
        fetchData();
    }, []);

    const lastMatch = null;
    const upcomingMatches = [];

    /**
     * Handlers (funções que lidam com eventos)
     */
    const handleSearch = (text) => {
        console.log('Buscando:', text);
        // Aqui você implementaria a lógica de busca
    };

    const handleFilterPress = () => {
        console.log('Abrir filtros');
        // Aqui você abriria um modal de filtros
    };

    const handleMatchPress = (match) => {
        console.log('Ver detalhes da partida:', match.id);
        // Aqui você navegaria para a tela de detalhes
    };

    const handleCreateTeam = () => {
        console.log('Criar novo time');
        // Aqui você navegaria para a tela de criar time
    };

    const handleTeamPress = (team) => {
        console.log('Ver time:', team.id);
        // Aqui você navegaria para a tela do time
    };

    const handleCourtPress = (court) => {
        console.log('Ver quadra:', court.id);
        // Aqui você navegaria para a tela da quadra
    };

    const handleScheduleCourt = (court) => {
        console.log('Agendar quadra:', court.id);
        // Aqui você navegaria para a tela de agendamento
    };

    const handleViewAllCourts = () => {
        console.log('Ver todas as quadras');
        // Aqui você navegaria para a tela de quadras
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Barra de busca */}
            <SearchBar
                onSearch={handleSearch}
                onFilterPress={handleFilterPress}
            />

            {/* Conteúdo rolável */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false} // Esconde a barra de rolagem
            >
                {/* SEÇÃO: ÚLTIMOS JOGOS */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        ÚLTIMOS JOGOS
                    </Text>

                    {lastMatch && (
                        <MatchCard
                            match={lastMatch}
                            onPress={() => handleMatchPress(lastMatch)}
                        />
                    )}
                </View>

                {/* SEÇÃO: PRÓXIMOS JOGOS */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        PRÓXIMOS JOGOS
                    </Text>

                    {upcomingMatches.map(match => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            onPress={() => handleMatchPress(match)}
                        />
                    ))}
                </View>

                {/* SEÇÃO: TIMES */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            TIMES
                        </Text>

                        <TouchableOpacity
                            onPress={handleCreateTeam}
                            style={styles.createButton}
                        >
                            <Text style={[styles.createButtonText, { color: colors.primary }]}>
                                + CRIAR TIME
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {teams.slice(0, 3).map(team => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onPress={() => handleTeamPress(team)}
                        />
                    ))}
                </View>

                {/* SEÇÃO: QUADRAS */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            QUADRAS
                        </Text>

                        <TouchableOpacity
                            onPress={handleViewAllCourts}
                            style={styles.viewAllButton}
                        >
                            <Text style={[styles.viewAllText, { color: colors.primary }]}>
                                VER DETALHES
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {courts.slice(0, 2).map(court => (
                        <CourtCard
                            key={court.id}
                            court={court}
                            onPress={() => handleCourtPress(court)}
                            onSchedulePress={() => handleScheduleCourt(court)}
                        />
                    ))}
                </View>

                {/* Espaço no final para não ficar colado no footer */}
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ocupa toda a tela
    },

    scrollView: {
        flex: 1,
    },

    section: {
        marginTop: 24,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginHorizontal: 16,
        marginBottom: 12,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },

    createButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },

    createButtonText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    viewAllButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },

    viewAllText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

/**
 * CONCEITOS:
 * 
 * 1. ScrollView: Container rolável para conteúdo que não cabe na tela
 * 2. showsVerticalScrollIndicator={false}: Esconde a barra de rolagem
 * 3. .find(): Encontra o primeiro item que satisfaz a condição
 * 4. .filter(): Filtra itens que satisfazem a condição
 * 5. .slice(0, 2): Pega os primeiros 2 itens do array
 * 6. .map(): Transforma cada item do array em um componente
 * 7. key={item.id}: Identificador único para cada item (obrigatório em listas)
 * 
 * ESTRUTURA:
 * 
 * View (container principal)
 *   └─ SearchBar
 *   └─ ScrollView (área rolável)
 *       └─ Seção 1 (Últimos Jogos)
 *       └─ Seção 2 (Próximos Jogos)
 *       └─ Seção 3 (Times)
 *       └─ Seção 4 (Quadras)
 */
