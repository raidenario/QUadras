/**
 * 🔔 TELA DE NOTIFICAÇÕES
 * 
 * Mostra todas as notificações do usuário.
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { notifications } from '../data/mockData';

export default function NotificationsScreen() {
    const { colors } = useTheme();

    /**
     * Retorna o ícone baseado no tipo de notificação
     */
    const getIcon = (type) => {
        switch (type) {
            case 'match':
                return 'football-outline';
            case 'team':
                return 'people-outline';
            case 'system':
                return 'information-circle-outline';
            default:
                return 'notifications-outline';
        }
    };

    /**
     * Formata a data da notificação
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;

        return date.toLocaleDateString('pt-BR');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Notificações
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map(notification => (
                    <TouchableOpacity
                        key={notification.id}
                        style={[
                            styles.notificationCard,
                            {
                                backgroundColor: notification.read
                                    ? colors.surface
                                    : colors.primary + '10', // 10 = 10% de opacidade
                            },
                        ]}
                        onPress={() => console.log('Ver notificação:', notification.id)}
                    >
                        {/* Ícone */}
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: colors.primary + '20' },
                            ]}
                        >
                            <Ionicons
                                name={getIcon(notification.type)}
                                size={24}
                                color={colors.primary}
                            />
                        </View>

                        {/* Conteúdo */}
                        <View style={styles.content}>
                            <Text
                                style={[
                                    styles.notificationTitle,
                                    { color: colors.text },
                                ]}
                                numberOfLines={1}
                            >
                                {notification.title}
                            </Text>
                            <Text
                                style={[
                                    styles.notificationMessage,
                                    { color: colors.textSecondary },
                                ]}
                                numberOfLines={2}
                            >
                                {notification.message}
                            </Text>
                            <Text
                                style={[
                                    styles.notificationDate,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {formatDate(notification.date)}
                            </Text>
                        </View>

                        {/* Indicador de não lida */}
                        {!notification.read && (
                            <View
                                style={[styles.unreadDot, { backgroundColor: colors.secondary }]}
                            />
                        )}
                    </TouchableOpacity>
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
    header: {
        padding: 16,
        paddingTop: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    notificationMessage: {
        fontSize: 14,
    },
    notificationDate: {
        fontSize: 12,
        marginTop: 4,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
