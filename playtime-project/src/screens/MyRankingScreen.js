
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { currentUser, scoringFAQ } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MyRankingScreen({ navigation }) {
    const { colors } = useTheme();

    const UserCard = () => {
        // Estilo inspirado no RankingScreen mas maior e focado
        const cardColor = '#d4af37'; // Ouro (assumindo que ele quer ver o melhor possível ou a dele)
        const headerColor = '#e2b239ff';
        const titleColor = '#FFF';

        const isImage = currentUser.avatar && (
            typeof currentUser.avatar === 'object' ||
            typeof currentUser.avatar === 'number' ||
            (typeof currentUser.avatar === 'string' && currentUser.avatar.length > 5)
        );

        return (
            <View style={[styles.cardContainer, { backgroundColor: headerColor, borderColor: cardColor }]}>
                {/* Header do Card */}
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={[styles.cardRating, { color: titleColor }]}>{currentUser.points || 1350}</Text>
                        <Text style={[styles.cardPosition, { color: titleColor }]}>PTS</Text>
                    </View>
                    <Text style={{ fontSize: 24, opacity: 0.8 }}>🇧🇷</Text>
                </View>

                {/* Avatar Grande */}
                <View style={styles.cardAvatarContainer}>
                    {isImage ? (
                        <Image
                            source={currentUser.avatar}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Text style={{ fontSize: 80 }}>👤</Text>
                    )}
                </View>

                {/* Nome */}
                <View style={styles.cardSection}>
                    <Text style={[styles.cardName, { color: titleColor }]}>{currentUser.firstName}</Text>
                    <Text style={[styles.cardNickname, { color: titleColor }]}>"{currentUser.nickname}"</Text>
                    <Text style={[styles.cardSurname, { color: titleColor }]}>{currentUser.surname}</Text>
                </View>

                {/* Stats */}
                <View style={styles.cardStats}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>J</Text>
                        <Text style={styles.statValue}>{currentUser.stats.matchesPlayed}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>V</Text>
                        <Text style={styles.statValue}>{currentUser.stats.wins}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>D</Text>
                        <Text style={styles.statValue}>{currentUser.stats.losses}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>E</Text>
                        <Text style={styles.statValue}>{currentUser.stats.draws}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const FAQItem = ({ item }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <View style={[styles.faqItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => setExpanded(!expanded)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
                </TouchableOpacity>
                {expanded && (
                    <View style={styles.faqBody}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{item.answer}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Simples */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.primary }]}>Meu Ranking</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.introText, { color: colors.textSecondary }]}>
                    Este é o seu cartão de jogador oficial. Mantenha sua pontuação alta para subir de nível!
                </Text>

                {/* User Card */}
                <View style={styles.cardWrapper}>
                    <UserCard />
                </View>

                {/* FAQ Section */}
                <View style={styles.faqSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Como funciona a pontuação?</Text>
                    <View style={styles.faqList}>
                        {scoringFAQ.map(item => (
                            <FAQItem key={item.id} item={item} />
                        ))}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    content: {
        padding: 20,
        alignItems: 'center',
    },
    introText: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 14,
    },
    cardWrapper: {
        marginBottom: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    // Styles copiados/adaptados do RankingScreen cardNormal
    cardContainer: {
        width: width * 0.7, // Maior que no ranking
        height: 480,       // Card bem alto e imponente
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
        paddingBottom: 8,
        marginBottom: 8,
    },
    cardRating: {
        fontSize: 32,
        fontWeight: '900',
    },
    cardPosition: {
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    cardAvatarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    cardSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    cardName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardNickname: {
        fontSize: 24,
        fontWeight: '900',
        marginVertical: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardSurname: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardStats: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.3)',
        paddingTop: 12,
        marginBottom: 8,
    },
    statRow: {
        alignItems: 'center',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // FAQ Styles
    faqSection: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    faqList: {
        width: '100%',
    },
    faqItem: {
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
        borderBottomWidth: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    faqBody: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 20,
    },
});
