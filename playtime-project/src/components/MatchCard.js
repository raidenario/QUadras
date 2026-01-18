/**
 * ⚽ CARD DE PARTIDA
 * 
 * Componente que exibe informações de uma partida.
 * Tem dois estilos: partida passada (com placar) e futura (aguardando).
 * 
 * CONCEITO: Um componente que recebe dados e renderiza de forma diferente
 * baseado no tipo de partida.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import CustomButton from './CustomButton';

/**
 * PROPS:
 * @param {object} match - Dados da partida (do mockData.js)
 * @param {function} onPress - Função ao clicar no card
 */
export default function MatchCard({ match, onPress }) {
    const { colors } = useTheme();

    // Verifica se é partida passada ou futura
    const isPast = match.type === 'past';

    /**
     * Formata a data para exibição
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();

        // Se for hoje
        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        }

        // Se for amanhã
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Amanhã';
        }

        // Senão, mostra a data
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: isPast ? colors.primary : colors.surface,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Cabeçalho do card */}
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={isPast ? colors.textOnPrimary : colors.textSecondary}
                    />
                    <Text
                        style={[
                            styles.dateText,
                            { color: isPast ? colors.textOnPrimary : colors.textSecondary },
                        ]}
                    >
                        {formatDate(match.date)}, {match.time}
                    </Text>
                </View>

                {/* Ícone do esporte */}
                <Text style={styles.sportIcon}>
                    {match.sport === 'football' ? '⚽' : '🏐'}
                </Text>
            </View>

            {/* Times */}
            <View style={styles.teamsContainer}>
                {/* Time 1 */}
                <View style={styles.team}>
                    <Text style={styles.teamLogo}>{match.team1.logo}</Text>
                    <Text
                        style={[
                            styles.teamName,
                            { color: isPast ? colors.textOnPrimary : colors.text },
                        ]}
                        numberOfLines={1}
                    >
                        {match.team1.name}
                    </Text>
                </View>

                {/* Placar ou VS */}
                <View style={styles.scoreContainer}>
                    {isPast ? (
                        // Mostra placar se já jogou
                        <Text
                            style={[styles.score, { color: colors.textOnPrimary }]}
                        >
                            {match.team1.score} - {match.team2.score}
                        </Text>
                    ) : (
                        // Mostra "VS" se ainda não jogou
                        <Text
                            style={[styles.vs, { color: colors.textSecondary }]}
                        >
                            VS
                        </Text>
                    )}
                </View>

                {/* Time 2 */}
                <View style={[styles.team, styles.teamRight]}>
                    <Text
                        style={[
                            styles.teamName,
                            { color: isPast ? colors.textOnPrimary : colors.text },
                        ]}
                        numberOfLines={1}
                    >
                        {match.team2.name}
                    </Text>
                    <Text style={styles.teamLogo}>{match.team2.logo}</Text>
                </View>
            </View>

            {/* Local */}
            <View style={styles.locationContainer}>
                <Ionicons
                    name="location-outline"
                    size={14}
                    color={isPast ? colors.textOnPrimary : colors.textSecondary}
                />
                <Text
                    style={[
                        styles.locationText,
                        { color: isPast ? colors.textOnPrimary : colors.textSecondary },
                    ]}
                    numberOfLines={1}
                >
                    {match.court.name}
                </Text>
            </View>

            {/* Rodapé do card */}
            <View style={styles.footer}>
                {isPast ? (
                    // Botão "VER DETALHES" para partidas passadas
                    <CustomButton
                        title="Ver Detalhes"
                        variant="secondary"
                        onPress={onPress}
                        style={styles.button}
                    />
                ) : (
                    // Contador de jogadores para partidas futuras
                    <View style={styles.playersContainer}>
                        <Ionicons
                            name="people-outline"
                            size={16}
                            color={colors.textSecondary}
                        />
                        <Text style={[styles.playersText, { color: colors.textSecondary }]}>
                            {match.players.current}/{match.players.max}
                        </Text>
                        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                            {match.status === 'waiting' ? 'Aguardando' : match.status}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    dateText: {
        fontSize: 14,
        fontWeight: '500',
    },

    sportIcon: {
        fontSize: 20,
    },

    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },

    team: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },

    teamRight: {
        flexDirection: 'column-reverse', // Inverte a ordem (logo embaixo)
    },

    teamLogo: {
        fontSize: 32,
    },

    teamName: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

    scoreContainer: {
        paddingHorizontal: 16,
    },

    score: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    vs: {
        fontSize: 16,
        fontWeight: '600',
    },

    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },

    locationText: {
        fontSize: 12,
        flex: 1,
    },

    footer: {
        marginTop: 12,
        alignItems: 'center',
    },

    button: {
        width: '100%',
    },

    playersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    playersText: {
        fontSize: 14,
        fontWeight: '600',
    },

    statusText: {
        fontSize: 14,
    },
});

/**
 * COMO USAR:
 * 
 * import MatchCard from './components/MatchCard';
 * import { matches } from './data/mockData';
 * 
 * function MinhaScreen() {
 *   return (
 *     <View>
 *       {matches.map(match => (
 *         <MatchCard
 *           key={match.id}
 *           match={match}
 *           onPress={() => console.log('Clicou na partida', match.id)}
 *         />
 *       ))}
 *     </View>
 *   );
 * }
 * 
 * CONCEITOS:
 * 
 * 1. Conditional Rendering: Renderiza diferente baseado em isPast
 * 2. numberOfLines={1}: Limita o texto a 1 linha (adiciona "..." se passar)
 * 3. flex: 1: Faz o elemento ocupar espaço disponível
 * 4. flexDirection: 'column-reverse': Inverte a ordem dos filhos
 */
