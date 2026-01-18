import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
    Platform,
    Dimensions,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ranking, teams } from '../data/mockData';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RankingScreen() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('players'); // 'players' | 'teams'

    // Estados para o Modal de Perfil
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handleOpenProfile = (player) => {
        setSelectedPlayer(player);
        setProfileModalVisible(true);
    };

    // Separar Top 3 e Resto
    const top3 = ranking.slice(0, 3);
    const others = ranking.slice(3);

    // Componente Card Tipo FIFA (Jogadores)
    const PlayerCard = ({ player, size = 'normal', rank }) => {
        const isSmall = size === 'small';

        // Cores baseadas no rank
        let cardColor = '#4a4a4a'; // Padrão (Grid)
        let headerColor = '#3a3a3a';
        let titleColor = '#fbbf24'; // Dourado padrão

        if (rank === 1) {
            cardColor = '#d4af37'; // Ouro
            headerColor = '#e2b239ff';
            titleColor = '#FFF';
        } else if (rank === 2) {
            cardColor = '#c0c0c0'; // Prata
            headerColor = '#a9a9a9';
            titleColor = '#FFF';
        } else if (rank === 3) {
            cardColor = '#cd7f32'; // Bronze
            headerColor = '#a85a22ff';
            titleColor = '#FFF';
        }

        // Lógica de Exibição do Avatar
        const renderAvatar = () => {
            // Verifica se é imagem (objeto require ou URI string longa que não seja emoji)
            const isImage = player.avatar && (
                typeof player.avatar === 'object' ||
                typeof player.avatar === 'number' ||
                (typeof player.avatar === 'string' && player.avatar.length > 5)
            );

            // 1. Tem Avatar (Imagem)? EXIBE E PONTO FINAL.
            if (isImage) {
                return (
                    <Image
                        source={typeof player.avatar === 'string' ? { uri: player.avatar } : player.avatar}
                        style={{
                            width: isSmall ? 60 : 80,
                            height: isSmall ? 60 : 80,
                            borderRadius: isSmall ? 30 : 40
                        }}
                    />
                );
            }

            // 2. Não tem imagem? Define o conteúdo padrão
            let avatarContent = player.avatar;

            // Se for Top 3, TEM QUE SER MEDALHA (se não tinha imagem)
            if (rank === 1) avatarContent = '🥇';
            else if (rank === 2) avatarContent = '🥈';
            else if (rank === 3) avatarContent = '🥉';
            // Se não for Top 3 e não tiver nada válido, bota boneco
            else if (!avatarContent || avatarContent === '🥇' || avatarContent === '🥈' || avatarContent === '🥉') {
                avatarContent = '👤';
            }

            return <Text style={{ fontSize: isSmall ? 40 : 50 }}>{avatarContent}</Text>;
        };

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleOpenProfile(player)}
                style={[
                    styles.cardContainer,
                    isSmall ? styles.cardSmall : styles.cardNormal,
                    { backgroundColor: headerColor, borderColor: cardColor, borderWidth: 2 }
                ]}
            >
                {/* Header do Card (Pontuação e Posição) */}
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardRating, { color: titleColor }]}>
                        {player.points}
                    </Text>
                    <Text style={[styles.cardPosition, { color: titleColor }]}>
                        PTS
                    </Text>
                </View>

                {/* Avatar */}
                <View style={styles.cardAvatarContainer}>
                    {renderAvatar()}
                </View>

                {/* Nome */}
                <View style={styles.cardSection}>
                    <Text style={[styles.cardName, { color: titleColor }]} numberOfLines={1}>
                        {player.firstName}
                    </Text>
                    <Text style={[styles.cardNickname, { color: titleColor }]} numberOfLines={1}>
                        "{player.nickname}"
                    </Text>
                    <Text style={[styles.cardSurname, { color: titleColor }]} numberOfLines={1}>
                        {player.surname}
                    </Text>
                </View>

                {/* Estatísticas (Grid) */}
                <View style={styles.cardStats}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>J</Text>
                        <Text style={styles.statValue}>{player.matchesPlayed}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>V</Text>
                        <Text style={styles.statValue}>{player.wins}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>D</Text>
                        <Text style={styles.statValue}>{player.losses}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>E</Text>
                        <Text style={styles.statValue}>{player.draws}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>G</Text>
                        <Text style={styles.statValue}>{player.goals}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Componente para Listagem de Times (Antigo - Pode remover ou manter se for usar em outro lugar, mas o novo é TeamRow)
    // Vamos manter o renderPlayersTab aqui

    const renderPlayersTab = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Podium (Top 3) */}
            <View style={styles.podiumContainer}>
                {/* 2nd Place */}
                <View style={[styles.podiumPlace, styles.place2]}>
                    <View style={styles.podiumNumberContainer}>
                        <Text style={styles.podiumNumber}>2</Text>
                    </View>
                    <PlayerCard player={top3[1]} rank={2} size="small" />
                </View>

                {/* 1st Place */}
                <View style={[styles.podiumPlace, styles.place1]}>
                    <View style={[styles.podiumNumberContainer, styles.winnerBadge]}>
                        <Text style={[styles.podiumNumber, { color: '#FFD700' }]}>1</Text>
                    </View>
                    <PlayerCard player={top3[0]} rank={1} />
                </View>

                {/* 3rd Place */}
                <View style={[styles.podiumPlace, styles.place3]}>
                    <View style={styles.podiumNumberContainer}>
                        <Text style={styles.podiumNumber}>3</Text>
                    </View>
                    <PlayerCard player={top3[2]} rank={3} size="small" />
                </View>
            </View>

            {/* Grid (Rest) */}
            <View style={styles.gridContainer}>
                <Text style={[styles.gridTitle, { color: colors.text }]}>Classificação Geral</Text>
                <View style={styles.grid}>
                    {others.map((player) => (
                        <View key={player.id} style={styles.gridItem}>
                            <View style={styles.gridRankBadge}>
                                <Text style={styles.gridRankText}>#{player.position}</Text>
                            </View>
                            <PlayerCard player={player} rank={player.position} size="small" />
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );

    // Componente para Linha da Tabela de Times
    const TeamRow = ({ team, index }) => {
        // Lógica do Ícone de Tendência
        let trendIcon = 'remove';
        let trendColor = '#bbb'; // Lighter gray as requested
        let trendBg = 'rgba(255, 255, 255, 0.1)';

        if (team.trend === 'up') {
            trendIcon = 'caret-up';
            trendColor = '#4caf50'; // Green
            trendBg = 'rgba(76, 175, 80, 0.1)';
        } else if (team.trend === 'down') {
            trendIcon = 'caret-down';
            trendColor = '#f44336'; // Red
            trendBg = 'rgba(244, 67, 54, 0.1)';
        }

        return (
            <View style={[styles.teamRowContainer, { borderBottomColor: colors.border }]}>
                {/* Coluna 1: Ranque + Tendência */}
                <View style={styles.colRank}>
                    <Text style={[styles.rankText, { color: colors.text }]}>{team.position}</Text>
                    <View style={[styles.trendBox, { backgroundColor: trendBg }]}>
                        <Ionicons name={trendIcon} size={10} color={trendColor} />
                    </View>
                </View>

                {/* Coluna 2: Equipe (Logo + Nome + Cidade) */}
                <View style={styles.colTeam}>
                    <Text style={styles.teamLogo}>{team.logo}</Text>
                    <View>
                        <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>{team.name}</Text>
                        <Text style={styles.teamCity}>{team.city}</Text>
                    </View>
                </View>

                {/* Coluna 3: Pontuação */}
                <View style={styles.colPoints}>
                    <Text style={[styles.pointsText, { color: colors.text }]}>{team.points} pts</Text>
                </View>

                {/* Coluna 4: V/D */}
                <View style={styles.colWinLoss}>
                    <Text style={[styles.winLossText, { color: colors.text }]}>
                        {team.wins}-{team.losses}
                    </Text>
                </View>
            </View>
        );
    };

    const renderTeamsTab = () => (
        <View style={styles.teamsTabContainer}>
            {/* Header da Tabela */}
            <View style={[styles.tableHeader, { backgroundColor: colors.surface }]}>
                <View style={styles.colRank}><Text style={styles.headerText}>Ranque</Text></View>
                <View style={styles.colTeam}><Text style={styles.headerText}>Equipe</Text></View>
                <View style={styles.colPoints}><Text style={styles.headerText}>Pontuação</Text></View>
                <View style={styles.colWinLoss}><Text style={styles.headerText}>V/D</Text></View>
            </View>

            <ScrollView contentContainerStyle={styles.tableScrollContent} showsVerticalScrollIndicator={false}>
                {teams.map((team, index) => (
                    <TeamRow key={team.id} team={team} index={index} />
                ))}
            </ScrollView>
        </View>
    );

    // Componente Modal de Perfil do Jogador
    const PlayerProfileModal = () => {
        if (!selectedPlayer) return null;

        return (
            <Modal
                visible={profileModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setProfileModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalOverlayTouch}
                        activeOpacity={1}
                        onPress={() => setProfileModalVisible(false)}
                    />
                    <View style={[styles.profileModalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.profileModalHeader}>
                            <Text style={[styles.profileModalTitle, { color: colors.text }]}>Perfil do Jogador</Text>
                            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.profileModalScroll}>
                            {/* Cabeçalho do Perfil (Avatar + Info Básica) */}
                            <View style={styles.profileHeaderSection}>
                                <View style={styles.modalAvatarContainer}>
                                    {selectedPlayer.avatar && typeof selectedPlayer.avatar !== 'string' ? (
                                        <Image source={selectedPlayer.avatar} style={styles.modalAvatarImage} />
                                    ) : (
                                        <Text style={{ fontSize: 60 }}>{selectedPlayer.avatar || '👤'}</Text>
                                    )}
                                </View>
                                <Text style={[styles.modalPlayerName, { color: colors.text }]}>
                                    {selectedPlayer.firstName} {selectedPlayer.surname}
                                </Text>
                                <Text style={[styles.modalNickname, { color: colors.primary }]}>
                                    "{selectedPlayer.nickname}"
                                </Text>
                                <Text style={[styles.modalLocation, { color: colors.textSecondary }]}>
                                    <Ionicons name="location-sharp" size={14} color={colors.textSecondary} /> {selectedPlayer.city || 'Cidade Desconhecida'} - {selectedPlayer.state || 'UF'}, {selectedPlayer.country || 'País'}
                                </Text>
                            </View>

                            <View style={[styles.separator, { backgroundColor: colors.border }]} />

                            {/* Seção Times Atuais */}
                            <View style={styles.infoSection}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Times Atuais</Text>
                                <View style={styles.tagsContainer}>
                                    {selectedPlayer.currentTeams && selectedPlayer.currentTeams.length > 0 ? (
                                        selectedPlayer.currentTeams.map((team, index) => (
                                            <View key={index} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                                <Ionicons name="shirt-outline" size={14} color={colors.primary} style={{ marginRight: 6 }} />
                                                <Text style={[styles.tagText, { color: colors.text }]}>{team}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={{ color: colors.textSecondary }}>Nenhum time atual</Text>
                                    )}
                                </View>
                            </View>

                            {/* Seção Favoritos (Jogadores, Jogos, Times) */}
                            <View style={styles.infoSection}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Favoritos</Text>

                                {/* Jogadores Favoritos */}
                                <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>Jogadores</Text>
                                <View style={styles.tagsContainer}>
                                    {selectedPlayer.favoritePlayers && selectedPlayer.favoritePlayers.map((p, i) => (
                                        <View key={i} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                            <Text style={{ marginRight: 6 }}>{p.avatar}</Text>
                                            <Text style={[styles.tagText, { color: colors.text }]}>{p.name}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Jogos Favoritos */}
                                <Text style={[styles.subSectionTitle, { color: colors.textSecondary, marginTop: 8 }]}>Jogos</Text>
                                <View style={styles.tagsContainer}>
                                    {selectedPlayer.favoriteGames && selectedPlayer.favoriteGames.map((g, i) => (
                                        <View key={i} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                            <Ionicons name="game-controller-outline" size={14} color={colors.primary} style={{ marginRight: 6 }} />
                                            <Text style={[styles.tagText, { color: colors.text }]}>{g.name}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Times Favoritos */}
                                <Text style={[styles.subSectionTitle, { color: colors.textSecondary, marginTop: 8 }]}>Times</Text>
                                <View style={styles.tagsContainer}>
                                    {selectedPlayer.favoriteTeams && selectedPlayer.favoriteTeams.map((t, i) => (
                                        <View key={i} style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                            <Text style={{ marginRight: 6 }}>{t.badge}</Text>
                                            <Text style={[styles.tagText, { color: colors.text }]}>{t.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Custom Header Tab Switcher */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'players' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
                    onPress={() => setActiveTab('players')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'players' ? colors.primary : colors.textSecondary }]}>
                        Jogadores
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'teams' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
                    onPress={() => setActiveTab('teams')}
                >
                    <Text style={[styles.tabText, { color: activeTab === 'teams' ? colors.primary : colors.textSecondary }]}>
                        Times
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === 'players' ? renderPlayersTab() : renderTeamsTab()}

            {/* Profile Modal */}
            <PlayerProfileModal />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        elevation: 4,
        zIndex: 10,
        marginBottom: 10, // Adicionado margem para afastar do conteudo
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    scrollContent: {
        flex: 1,
        padding: 16,
    },
    // Podium Styles
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 32,
        marginTop: 0, // Aumentado de 16 para evitar corte no topo
        height: 300, // Aumentado de 250 para caber o card escalado + badge
    },
    podiumPlace: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 4,
    },
    place1: {
        zIndex: 3,
        marginBottom: 20, // Levanta o 1º lugar
        transform: [{ scale: 1.1 }], // Aumenta um pouco
    },
    place2: {
        zIndex: 2,
    },
    place3: {
        zIndex: 1,
    },
    podiumNumberContainer: {
        marginBottom: -10, // Sobrepõe um pouco a carta
        zIndex: 10,
        backgroundColor: '#2c2c2c',
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    winnerBadge: {
        borderColor: '#FFD700',
        backgroundColor: '#332b00',
    },
    podiumNumber: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Card Styles (FIFA Style)
    cardContainer: {
        borderRadius: 8, // Forma de escudo suavizada (borda arredondada simples por enquanto)
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        // Sombra leve
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardNormal: {
        width: width * 0.30, // Reduzido de 0.35 para evitar colagem nas bordas
        height: 240,
    },
    cardSmall: {
        width: width * 0.30, // Reduzido de 0.35 para 0.30 para caber 3 na tela sem cortar
        height: 200,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        width: '100%',
        paddingBottom: 4,
        marginBottom: 4,
    },
    cardRating: {
        fontSize: 18,
        fontWeight: '900',
        marginRight: 4,
    },
    cardPosition: {
        fontSize: 10,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    cardAvatarContainer: {
        marginVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardName: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardNickname: {
        fontSize: 14,
        fontWeight: '900',
        textAlign: 'center',
        marginVertical: 1,
    },
    cardSurname: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 4,
    },
    statRow: {
        alignItems: 'center',
        marginHorizontal: 3,
        marginBottom: 2,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 8,
        fontWeight: 'bold',
    },
    statValue: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Grid Styles
    gridContainer: {
        marginTop: 16,
    },
    gridTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around', // Changed to space-around to center
    },
    gridItem: {
        width: '45%', // Adjusted to fit with new width
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
    },
    gridRankBadge: {
        position: 'absolute',
        top: -10,
        left: 0,
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 10,
    },
    gridRankText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },

    // Teams Tab Styles
    teamsList: {
        paddingVertical: 8,
    },
    teamCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    teamRank: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 16,
        width: 30,
        textAlign: 'center',
    },
    teamLogo: {
        fontSize: 24,
        marginRight: 16,
    },
    teamInfo: {
        flex: 1,
    },
    teamName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    teamMembers: {
        fontSize: 12,
    },
    teamStats: {
        alignItems: 'flex-end',
    },
    teamWins: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    teamLosses: {
        fontSize: 12,
    },

    // New Table Styles
    teamsTabContainer: {
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerText: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableScrollContent: {
        paddingBottom: 20,
    },
    teamRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    // Columns
    colRank: {
        width: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 6,
    },
    trendBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colTeam: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamLogo: {
        fontSize: 24,
        marginRight: 12,
    },
    teamName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    teamCity: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    colPoints: {
        width: 80,
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    colWinLoss: {
        width: 60,
        alignItems: 'flex-end',
    },
    winLossText: {
        fontSize: 12,
        opacity: 0.8,
    },
    colWinLoss: {
        width: 60,
        alignItems: 'flex-end',
    },
    winLossText: {
        fontSize: 12,
        opacity: 0.8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalOverlayTouch: {
        flex: 1,
    },
    profileModalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '80%',
        width: '100%',
    },
    profileModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileModalScroll: {
        paddingBottom: 40,
    },
    profileHeaderSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalAvatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#333', // Fallback color
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#FFD700', // Gold border for premium feel
    },
    modalAvatarImage: {
        width: '100%',
        height: '100%',
    },
    modalPlayerName: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalNickname: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    modalLocation: {
        fontSize: 14,
        marginTop: 4,
    },
    separator: {
        height: 1,
        width: '100%',
        marginVertical: 16,
    },
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#f44336', // Accent color
        paddingLeft: 8,
    },
    subSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
