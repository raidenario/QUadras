/**
 * 📱 HEADER (CABEÇALHO)
 * 
 * Componente do cabeçalho que aparece no topo de todas as telas.
 * Contém: Logo, nome do app, ícone de usuário, notificações e tema.
 * 
 * CONCEITO: Este é um componente "stateful" (com estado), pois
 * precisa controlar se o dropdown está aberto ou fechado.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Platform,
    Image,
    FlatList,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { currentUser, notifications } from '../data/mockData';

/**
 * PROPS:
 * @param {function} onNotificationPress - Função ao clicar em notificações
 */
export default function Header({ onNotificationPress }) {
    const { colors, isDark, toggleTheme, themeMode } = useTheme();
    const navigation = useNavigation();
    const { user, logout, isGuest } = useAuth();

    // Estado para controlar se o dropdown está visível
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Estado para o Modal de Logout
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    // Estado para o Modal de Notificações
    const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);

    // Contar notificações não lidas
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogoutPress = () => {
        setDropdownVisible(false); // Fecha o dropdown
        setLogoutModalVisible(true); // Abre o modal de confirmação
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        logout();
    };

    /**
     * Abre/fecha o dropdown
     */
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    /**
     * Retorna o ícone correto do tema
     */
    const getThemeIcon = () => {
        return isDark ? 'moon' : 'sunny';
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.header }]}>
            {/* Logo e Nome do App */}
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>🎮</Text>
                <Text style={[styles.appName, { color: colors.textOnPrimary }]}>
                    PLAYTIME
                </Text>
            </View>

            {/* Ícones da direita */}
            <View style={styles.iconsContainer}>
                {/* Ícone de Tema (Light/Dark/Auto) */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={getThemeIcon()}
                        size={24}
                        color={colors.textOnPrimary}
                    />
                </TouchableOpacity>

                {/* Ícone de Notificações */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setNotificationsModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.textOnPrimary}
                    />
                    {/* Badge de notificações não lidas */}
                    {unreadCount > 0 && (
                        <View style={[styles.badge, { backgroundColor: colors.error }]}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Ícone de Usuário (com dropdown) */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={toggleDropdown}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color={colors.textOnPrimary}
                    />
                </TouchableOpacity>
            </View>

            {/* DROPDOWN MENU */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={toggleDropdown}
            >
                {/* Overlay (fundo escuro) */}
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={toggleDropdown}
                >
                    {/* Menu Dropdown */}
                    <View
                        style={[
                            styles.dropdown,
                            { backgroundColor: colors.surface },
                            Platform.OS === 'ios' ? styles.dropdownIOS : styles.dropdownAndroid,
                        ]}
                    >
                        {!isGuest ? (
                            // Se estiver logado
                            <>
                                <View style={styles.userInfo}>
                                    <View style={styles.avatarContainer}>
                                        {user && user.photo_url ? (
                                            <Image
                                                source={{ uri: user.photo_url }}
                                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                            />
                                        ) : (
                                            <FontAwesome5 name="user-circle" size={40} color={colors.primary} solid />
                                        )}
                                    </View>
                                    <View style={styles.userInfoText}>
                                        <Text style={[styles.userName, { color: colors.primary }]}>
                                            {user?.name || 'Usuário'}
                                        </Text>
                                        <Text style={[styles.userEmail, { color: colors.primary }]}>
                                            {user?.email || ''}
                                        </Text>
                                    </View>
                                </View>

                                {/* Menu Items Logado */}
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        navigation.navigate('Profile');
                                    }}
                                >
                                    <Ionicons name="person" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Meu Perfil
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        navigation.navigate('MyTeams');
                                    }}
                                >
                                    <Ionicons name="shield" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Meus Times
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => setDropdownVisible(false)}
                                >
                                    <Ionicons name="calendar-clear" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Meus Jogos
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        navigation.navigate('MyRanking');
                                    }}
                                >
                                    <Ionicons name="trophy" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Meu Ranking
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => setDropdownVisible(false)}
                                >
                                    <Ionicons name="settings" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Configurações
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, styles.lastMenuItem]}
                                    onPress={handleLogoutPress}
                                >
                                    <Ionicons name="log-out" size={20} color={colors.primary} />
                                    <Text style={[styles.menuText, { color: colors.primary }]}>
                                        Sair
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            // Se for VISITANTE
                            <>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        logout(); // Sai do modo visitante e volta para o AuthStack (Login)
                                    }}
                                >
                                    <Ionicons name="log-in-outline" size={20} color={colors.text} />
                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                        Entrar
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => {
                                        setDropdownVisible(false);
                                        logout(); // Sai do modo visitante e volta para o AuthStack (Login)
                                    }}
                                >
                                    <Ionicons name="person-add-outline" size={20} color={colors.text} />
                                    <Text style={[styles.menuText, { color: colors.text }]}>
                                        Cadastrar-se
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
            <Modal
                visible={logoutModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.logoutModal, { backgroundColor: colors.surface }]}>
                        <Ionicons name="log-out" size={48} color={colors.primary} style={{ marginBottom: 16 }} />

                        <Text style={[styles.logoutTitle, { color: colors.primary }]}>
                            Tem certeza que deseja sair?
                        </Text>
                        <Text style={[styles.logoutMessage, { color: colors.textSecondary }]}>
                            Você precisará fazer login novamente para acessar sua conta.
                        </Text>

                        <View style={styles.logoutButtonsContainer}>
                            {/* Botão Cancelar (Outline) */}
                            <TouchableOpacity
                                style={[styles.logoutButton, styles.cancelButton, { borderColor: colors.primary }]}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={[styles.buttonText, { color: colors.primary }]}>Cancelar</Text>
                                <Ionicons name="close" size={20} color={colors.primary} />
                            </TouchableOpacity>

                            {/* Botão Aceitar (Filled) */}
                            <TouchableOpacity
                                style={[styles.logoutButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                                onPress={confirmLogout}
                            >
                                <Text style={[styles.buttonText, { color: '#FFF' }]}>Sair</Text>
                                <Ionicons name="checkmark" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* MODAL DE NOTIFICAÇÕES */}
            <Modal
                visible={notificationsModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setNotificationsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalOverlayTouch}
                        activeOpacity={1}
                        onPress={() => setNotificationsModalVisible(false)}
                    />
                    <View style={[styles.notificationsModalContent, { backgroundColor: colors.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Notificações</Text>
                            <TouchableOpacity onPress={() => setNotificationsModalVisible(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.notificationList}
                            renderItem={({ item }) => {
                                let iconName = 'information-circle';
                                let iconColor = colors.primary;

                                if (item.type === 'match') {
                                    iconName = 'football';
                                    iconColor = '#4caf50';
                                } else if (item.type === 'team') {
                                    iconName = 'shield';
                                    iconColor = '#2196f3';
                                }

                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.notificationItem,
                                            { backgroundColor: item.read ? 'transparent' : colors.primary + '10', borderBottomColor: colors.border }
                                        ]}
                                    >
                                        <View style={[styles.notificationIcon, { backgroundColor: iconColor + '20' }]}>
                                            <Ionicons name={iconName} size={20} color={iconColor} />
                                        </View>
                                        <View style={styles.notificationTextContainer}>
                                            <Text style={[styles.notificationTitle, { color: colors.text, fontWeight: item.read ? 'normal' : 'bold' }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[styles.notificationMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                                                {item.message}
                                            </Text>
                                            <Text style={[styles.notificationDate, { color: colors.textSecondary }]}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        {!item.read && (
                                            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="notifications-off-outline" size={48} color={colors.textSecondary} />
                                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma notificação</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',           // Itens em linha (horizontal)
        justifyContent: 'space-between', // Espaço entre logo e ícones
        alignItems: 'center',           // Centraliza verticalmente
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40, // Espaço para status bar
        paddingBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    logo: {
        fontSize: 28,
    },

    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },

    iconButton: {
        position: 'relative', // Para posicionar o badge
    },

    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Dropdown
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro transparente
    },

    dropdown: {
        position: 'absolute',
        right: 16,
        borderRadius: 8,
        minWidth: 260, // Aumentado para não esmagar conteúdo
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },

    dropdownIOS: {
        top: 90, // Posição no iOS
    },

    dropdownAndroid: {
        top: 80, // Posição no Android
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },

    avatarContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarEmoji: {
        fontSize: 24,
    },

    userInfoText: {
        flex: 1,
    },

    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },

    userEmail: {
        fontSize: 12,
        fontWeight: '500',
    },

    dividerContainer: {
        paddingHorizontal: 16,
    },

    divider: {
        height: 1,
        marginLeft: 44, // Alinha com o início do texto (pula o ícone de 20 + gap + padding)
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8, // Reduzido de 12 para 10 para diminuir espaço entre itens
        gap: 12,
    },

    lastMenuItem: {
        paddingBottom: 34,
        paddingHorizontal: 18, // Aumentado para garantir bom espaço no final
    },

    menuText: {
        fontSize: 16,
    },

    // Modal de Logout
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    logoutModal: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },

    logoutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },

    logoutMessage: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },

    logoutButtonsContainer: {
        flexDirection: 'row',
        gap: 40,
        width: '100%',
    },

    logoutButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },

    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
    },

    confirmButton: {
        // backgroundColor definido inline
    },


    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Notifications Modal Styles
    notificationsModalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 20,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    notificationList: {
        paddingBottom: 40,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'start',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
    },
    notificationIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    notificationTextContainer: {
        flex: 1,
        marginRight: 8,
    },
    notificationTitle: {
        fontSize: 14,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 13,
        marginBottom: 6,
        lineHeight: 18,
    },
    notificationDate: {
        fontSize: 11,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});

/**
 * CONCEITOS APRENDIDOS:
 * 
 * 1. useState: Gerencia estado local (dropdown aberto/fechado)
 * 2. Modal: Componente para criar popups/overlays
 * 3. Platform: Detecta se é iOS ou Android para estilos específicos
 * 4. Conditional Rendering: Mostra conteúdo diferente baseado em condição
 *    (usuário logado vs não logado)
 * 5. Positioning: position: 'absolute' para posicionar elementos
 */
