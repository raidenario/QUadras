/**
 * 🛡️ TELA DE TIMES
 * 
 * Lista todos os times disponíveis.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import SearchBar from '../components/SearchBar';
import TeamCard from '../components/TeamCard';
import api from '../services/api';

export default function TeamsScreen({ navigation }) {
    const { colors } = useTheme();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams');
            // Assumindo que a API retorna { data: [...] }
            setTeams(response.data.data);
        } catch (error) {
            console.log("Erro ao buscar times:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SearchBar placeholder="Buscar times..." />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        TODOS OS TIMES
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('TeamEditor', { mode: 'create' })}
                        style={styles.createButton}
                    >
                        <Text style={[styles.createButtonText, { color: colors.primary }]}>
                            + CRIAR TIME
                        </Text>
                    </TouchableOpacity>
                </View>

                {teams.map(team => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        onPress={() => console.log('Ver time:', team.id)}
                    />
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
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
});
