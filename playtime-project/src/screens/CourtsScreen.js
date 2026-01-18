import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import SearchBar from '../components/SearchBar';
import CourtCard from '../components/CourtCard';
import { courts } from '../data/mockData';

export default function CourtsScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SearchBar placeholder="Buscar quadras..." />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Quadras Disponíveis
                </Text>

                {courts.map((court) => (
                    <CourtCard key={court.id} court={court} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});
