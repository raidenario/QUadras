/**
 * ⚽ TELA DE JOGOS
 * 
 * Lista todos os jogos (passados e futuros).
 * Por enquanto é uma tela simples, mas pode ser expandida.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import SearchBar from '../components/SearchBar';
import MatchCard from '../components/MatchCard';
import { matches } from '../data/mockData';

export default function GamesScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SearchBar placeholder="Buscar jogos..." />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    TODOS OS JOGOS
                </Text>

                {matches.map(match => (
                    <MatchCard
                        key={match.id}
                        match={match}
                        onPress={() => console.log('Ver jogo:', match.id)}
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
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
    },
});
