/**
 * 🛡️ CARD DE TIME
 * 
 * Componente que exibe informações de um time.
 * Mostra logo, nome, status e número de membros.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

/**
 * PROPS:
 * @param {object} team - Dados do time (do mockData.js)
 * @param {function} onPress - Função ao clicar no card
 */
export default function TeamCard({ team, onPress }) {
    const { colors } = useTheme();

    /**
     * Calcula a porcentagem de membros (Defensivo)
     */
    const getMemberPercentage = () => {
        if (!team.members || !team.members.max) return 0;
        return (team.members.current / team.members.max) * 100;
    };

    /**
     * Retorna a cor da barra baseado na porcentagem
     */
    const getBarColor = () => {
        const percentage = getMemberPercentage();
        if (percentage >= 90) return colors.success;
        if (percentage >= 50) return colors.warning;
        return colors.secondary;
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Logo do time */}
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>{team.logo || '🛡️'}</Text>
            </View>

            {/* Informações do time */}
            <View style={styles.infoContainer}>
                {/* Nome do time */}
                <Text
                    style={[styles.teamName, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {team.name}
                </Text>

                {/* Status */}
                <Text style={[styles.status, { color: colors.textSecondary }]}>
                    {team.status}
                </Text>

                {/* Contador de membros */}
                <View style={styles.membersContainer}>
                    <Ionicons
                        name="people-outline"
                        size={16}
                        color={colors.textSecondary}
                    />
                    <Text style={[styles.membersText, { color: colors.textSecondary }]}>
                        {team.members ? `${team.members.current}/${team.members.max}` : `${team.members_count || 0} membros`}
                    </Text>
                </View>

                {/* Barra de progresso */}
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${getMemberPercentage()}%`,
                                backgroundColor: getBarColor(),
                            },
                        ]}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        gap: 16,
    },

    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        fontSize: 36,
    },

    infoContainer: {
        flex: 1,
        gap: 6,
    },

    teamName: {
        fontSize: 16,
        fontWeight: '600',
    },

    status: {
        fontSize: 14,
    },

    membersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },

    membersText: {
        fontSize: 14,
        fontWeight: '600',
    },

    progressBar: {
        height: 6,
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden', // Esconde o que passar da borda
    },

    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
});

/**
 * CONCEITOS:
 * 
 * 1. Barra de Progresso: Usa width em porcentagem para mostrar progresso
 * 2. overflow: 'hidden': Esconde conteúdo que passa da borda arredondada
 * 3. Template Literals: `${valor}%` para criar strings dinâmicas
 */
