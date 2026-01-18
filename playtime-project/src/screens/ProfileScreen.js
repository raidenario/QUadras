/**
 * 👤 TELA DE PERFIL
 *
 * Permite ao usuário editar suas informações e visualizar seus favoritos.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    Alert,
    Pressable
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme/ThemeContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {
    currentUser,
    availableTeams,
    availableGames,
    availablePlayers
} from '../data/mockData';

export default function ProfileScreen({ navigation }) {
    const { colors } = useTheme();

    // Estados para os campos do formulário
    const [firstName, setFirstName] = useState(currentUser.firstName || '');
    const [surname, setSurname] = useState(currentUser.surname || '');
    const [nickname, setNickname] = useState(currentUser.nickname || '');
    const [email, setEmail] = useState(currentUser.email || '');
    const [city, setCity] = useState(currentUser.city || '');
    const [state, setState] = useState(currentUser.state || '');
    const [country, setCountry] = useState(currentUser.country || '');

    // Estado do Avatar
    const [avatar, setAvatar] = useState(currentUser.avatar);

    // Estados para favoritos
    const [favTeams, setFavTeams] = useState(currentUser.favoriteTeams || []);
    const [favGames, setFavGames] = useState(currentUser.favoriteGames || []);
    const [favPlayers, setFavPlayers] = useState(currentUser.favoritePlayers || []);

    // Estado do Modal de Seleção
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null); // 'team', 'game', 'player'
    const [modalItems, setModalItems] = useState([]); // Itens disponíveis para seleção

    const handleSave = () => {
        // Aqui seria a chamada para API para atualizar o perfil
        console.log('Dados salvos:', {
            firstName,
            surname,
            nickname,
            surname,
            nickname,
            email,
            city,
            state,
            country,
            avatar,
            favTeams,
            favGames,
            favPlayers
        });
        alert('Perfil atualizado com sucesso!');
        navigation.goBack();
    };

    // Função para escolher imagem da galeria
    const pickImage = async () => {
        try {
            // Solicitar permissão
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Revertendo para MediaTypeOptions para evitar crash
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setAvatar({ uri: result.assets[0].uri });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível abrir a galeria.');
        }
    };

    // Função para tirar foto com a câmera
    const takePhoto = async () => {
        try {
            // Solicitar permissão
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera.');
                return;
            }

            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setAvatar({ uri: result.assets[0].uri });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
        }
    };

    // Abre o modal com os itens corretos
    const openSelectionModal = (type) => {
        setModalType(type);
        let items = [];

        if (type === 'team') items = availableTeams;
        else if (type === 'game') items = availableGames;
        else if (type === 'player') items = availablePlayers;

        setModalItems(items);
        setModalVisible(true);
    };

    // Alterna a seleção de um item
    const toggleSelection = (item) => {
        if (modalType === 'team') {
            setFavTeams(prev => {
                const exists = prev.find(i => i.id === item.id);
                if (exists) return prev.filter(i => i.id !== item.id);
                return [...prev, item];
            });
        } else if (modalType === 'game') {
            setFavGames(prev => {
                const exists = prev.find(i => i.id === item.id);
                if (exists) return prev.filter(i => i.id !== item.id);
                return [...prev, item];
            });
        } else if (modalType === 'player') {
            setFavPlayers(prev => {
                const exists = prev.find(i => i.id === item.id);
                if (exists) return prev.filter(i => i.id !== item.id);
                return [...prev, item];
            });
        }
    };

    // Verifica se um item está selecionado
    const isSelected = (id) => {
        if (modalType === 'team') return favTeams.some(i => i.id === id);
        if (modalType === 'game') return favGames.some(i => i.id === id);
        if (modalType === 'player') return favPlayers.some(i => i.id === id);
        return false;
    };

    const FavoritesSection = ({ title, items, type }) => (
        <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
            <View style={styles.favoritesRow}>
                {items && items.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.favoriteChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        {type === 'team' && <Text style={styles.chipIcon}>{item.badge}</Text>}
                        {type === 'player' && <Text style={styles.chipIcon}>{item.avatar}</Text>}
                        {type === 'game' && <Ionicons name="game-controller" size={16} color={colors.primary} style={{ marginRight: 6 }} />}

                        <Text style={[styles.chipText, { color: colors.text }]}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
                {/* Botão de Adicionar */}
                <TouchableOpacity
                    style={[styles.addChip, { borderColor: colors.primary }]}
                    onPress={() => openSelectionModal(type)}
                >
                    <Ionicons name="add" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Helper para determinar a fonte da imagem
    const getAvatarSource = () => {
        if (!avatar) return null;
        if (typeof avatar === 'string') return { uri: avatar }; // Se for string (emoji antigo ou URI)
        if (avatar.uri) return avatar; // Objeto { uri: ... }
        return avatar; // require(...) (number)
    };

    const avatarSource = getAvatarSource();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.primary }]}>Meu Perfil</Text>

                {/* Placeholder para balancear o header */}
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        {/* Usando Pressable para melhor controle de toque */}
                        <Pressable
                            onPress={pickImage}
                            style={({ pressed }) => [
                                styles.avatarImageWrapper,
                                { opacity: pressed ? 0.8 : 1 }
                            ]}
                        >
                            {avatarSource ? (
                                <Image
                                    source={avatarSource}
                                    style={{ width: 100, height: 100, borderRadius: 50 }}
                                />
                            ) : (
                                <FontAwesome5 name="user-circle" size={100} color={colors.primary} solid />
                            )}
                        </Pressable>

                        <TouchableOpacity
                            style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
                            onPress={takePhoto}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    <CustomInput
                        label="Nome"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Seu nome"
                    />

                    <CustomInput
                        label="Sobrenome"
                        value={surname}
                        onChangeText={setSurname}
                        placeholder="Seu sobrenome"
                    />

                    <CustomInput
                        label="Apelido"
                        value={nickname}
                        onChangeText={setNickname}
                        placeholder="Como prefere ser chamado"
                    />

                    <CustomInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <CustomInput
                                label="Cidade"
                                value={city}
                                onChangeText={setCity}
                                placeholder="Sua cidade"
                            />
                        </View>
                        <View style={{ width: 80 }}>
                            <CustomInput
                                label="UF"
                                value={state}
                                onChangeText={setState}
                                placeholder="UF"
                                maxLength={2}
                            />
                        </View>
                    </View>

                    <CustomInput
                        label="País"
                        value={country}
                        onChangeText={setCountry}
                        placeholder="Seu país"
                    />
                </View>

                {/* Favorites Sections */}
                <FavoritesSection
                    title="Times Favoritos"
                    items={favTeams}
                    type="team"
                />

                <FavoritesSection
                    title="Jogos Favoritos"
                    items={favGames}
                    type="game"
                />

                <FavoritesSection
                    title="Jogadores Favoritos"
                    items={favPlayers}
                    type="player"
                />

                {/* Save Button */}
                <CustomButton
                    title="Salvar Alterações"
                    onPress={handleSave}
                    style={styles.saveButton}
                />

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* MODAL DE SELEÇÃO */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.selectionModal, { backgroundColor: colors.surface }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    Selecionar {modalType === 'team' ? 'Times' : modalType === 'game' ? 'Jogos' : 'Jogadores'}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={colors.text} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={modalItems}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item }) => {
                                    const selected = isSelected(item.id);
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.listItem,
                                                { borderColor: selected ? colors.primary : colors.border },
                                                selected && { backgroundColor: colors.primary + '10' }
                                            ]}
                                            onPress={() => toggleSelection(item)}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {modalType === 'team' && <Text style={styles.listIcon}>{item.badge}</Text>}
                                                {modalType === 'player' && <Text style={styles.listIcon}>{item.avatar}</Text>}
                                                {modalType === 'game' && <Ionicons name="game-controller-outline" size={20} color={colors.text} style={{ marginRight: 12 }} />}

                                                <Text style={[
                                                    styles.listItemText,
                                                    { color: selected ? colors.primary : colors.text, fontWeight: selected ? 'bold' : 'normal' }
                                                ]}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            {selected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                                        </TouchableOpacity>
                                    );
                                }}
                            />

                            <CustomButton
                                title="Concluir"
                                onPress={() => setModalVisible(false)}
                                style={{ marginTop: 16 }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
        width: 100, // Tamanho fixo para o container
        height: 100,
        // Mantendo zIndex para garantir que não fique atrás de nada
        zIndex: 1,
    },
    avatarImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        // zIndex alto para garantir clique
        zIndex: 5,
    },
    avatarEmoji: {
        fontSize: 80,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: -8, // Ajuste para ficar fora do círculo da imagem
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        elevation: 5,
        zIndex: 10, // Garante que fique por cima da imagem (mas a imagem ainda deve ser clicável na área vazia)
    },
    formContainer: {
        marginBottom: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    favoritesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    favoriteChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    addChip: {
        width: 36,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipIcon: {
        marginRight: 6,
        fontSize: 16,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        marginTop: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    selectionModal: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '70%',
        width: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 24,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    listIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    listItemText: {
        fontSize: 16,
    },
});
