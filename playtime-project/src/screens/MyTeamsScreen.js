
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { myTeams } from '../data/mockData'; // Importando dados mockados
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function MyTeamsScreen({ navigation }) {
    const { colors } = useTheme();
    const [teams, setTeams] = useState(myTeams);

    // Efeito para recarregar ou atualizar lista se necessário (simulado)
    useEffect(() => {
        setTeams(myTeams);
    }, []);

    const handleCreateTeam = () => {
        navigation.navigate('TeamEditor', { mode: 'create' });
    };

    const handleEditTeam = (team) => {
        navigation.navigate('TeamEditor', { mode: 'edit', team });
    };

    const renderTeamItem = ({ item }) => {
        // Verificar se logo é emoji ou imagem (mesma lógica de antes)
        const isEmoji = typeof item.logo === 'string' && item.logo.length < 5;

        return (
            <TouchableOpacity
                style={[styles.teamCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleEditTeam(item)}
                activeOpacity={0.7}
            >
                <View style={[styles.teamLogoContainer, { backgroundColor: colors.background }]}>
                    {isEmoji ? (
                        <Text style={{ fontSize: 32 }}>{item.logo}</Text>
                    ) : (
                        item.logo && <Image source={item.logo} style={styles.teamLogoImage} />
                    )}
                </View>

                <View style={styles.teamInfo}>
                    <Text style={[styles.teamName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.teamLocation, { color: colors.textSecondary }]}>
                        {item.city} - {item.state}, {item.country}
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statBadge}>
                            <Ionicons name="people" size={14} color={colors.primary} />
                            <Text style={[styles.statText, { color: colors.text }]}>{item.members} membros</Text>
                        </View>
                        <View style={[styles.statBadge, { marginLeft: 12 }]}>
                            <Ionicons name="trophy" size={14} color="#FFD700" />
                            <Text style={[styles.statText, { color: colors.text }]}>{item.wins} vitórias</Text>
                        </View>
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.primary }]}>Meus Times</Text>
                <TouchableOpacity onPress={handleCreateTeam}>
                    <Ionicons name="add-circle" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={teams}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderTeamItem}
                ListHeaderComponent={
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: colors.primary }]}
                        onPress={handleCreateTeam}
                    >
                        <Ionicons name="add" size={24} color="#FFF" />
                        <Text style={styles.createButtonText}>Criar Novo Time</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome5 name="users" size={48} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Você ainda não tem times. Crie um para começar!
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        elevation: 4,
        zIndex: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    teamCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    teamLogoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    teamLogoImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    teamInfo: {
        flex: 1,
    },
    teamName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    teamLocation: {
        fontSize: 12,
        marginBottom: 8,
    },
    statsContainer: {
        flexDirection: 'row',
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        width: '70%',
    },
});
