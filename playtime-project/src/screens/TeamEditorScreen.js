
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    Image,
    Modal,
    FlatList
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { ranking } from '../data/mockData'; // Usando ranking como lista de "Todos os Jogadores"

export default function TeamEditorScreen({ navigation, route }) {
    const { colors } = useTheme();
    const { mode, team } = route.params || { mode: 'create' };

    // Form States
    const [name, setName] = useState('');
    const [tag, setTag] = useState(''); // Novo state para TAG
    const [description, setDescription] = useState(''); // Novo state para Descrição
    const [logo, setLogo] = useState(null); // URI da imagem
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('Brasil');
    const [members, setMembers] = useState([]); // Array de jogadores adicionados
    const [loading, setLoading] = useState(false);

    // Modal States
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteSource, setInviteSource] = useState(null); // 'friends' | 'all' | null (menu)

    useEffect(() => {
        if (mode === 'edit' && team) {
            setName(team.name);
            setTag(team.tag || '');
            setDescription(team.description || '');
            // Se for emoji (string curta), tratamos diferente. Se for URI/require (mock), setamos.
            // No mock atual, logo é string emoji ou require.
            // Para simplificar, se for emoji mantemos como está na lógica de exibição, mas o state 'logo' espera URI.
            // Vamos assumir que edição de mock com emoji não preenche o picker de imagem, usuário escolhe nova.
            setCity(team.city);
            setState(team.state);
            setCountry(team.country);
            navigation.setOptions({ headerTitle: 'Editar Time' });

            // Simular membros já existentes no edit
            if (team.membersCount) {
                // Mockando membros se não existirem no objeto time
                setMembers(ranking.slice(0, Math.min(team.membersCount, 5)));
            }
        }
    }, [mode, team]);

    // Permissions (Request on mount if needed, usually managed by expo-image-picker automatically on click)

    const pickImage = async () => {
        // No permission request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setLogo(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name || !tag) {
            Alert.alert('Erro', 'Nome e Tag são obrigatórios.');
            return;
        }

        if (tag.length < 2 || tag.length > 4) {
            Alert.alert('Erro', 'A Tag deve ter entre 2 e 4 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                team: {
                    name,
                    tag: tag.toUpperCase(),
                    description: description || `${city} - ${state}`,
                    team_type: 'primary',
                    // logo_url: logo // TODO: Upload de imagem
                }
            };

            if (mode === 'create') {
                await api.post('/teams', payload);
                Alert.alert('Sucesso', 'Time criado com sucesso!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                // Editar time (assumindo rota de update, mas não listada no README para times, só members?)
                // API docs não listou PUT /teams/:id explicitamente, mas vamos assumir ou deixar log
                console.log('Update team not implemented fully yet');
                Alert.alert('Sucesso', 'Time atualizado (simulação)', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.log("Erro ao salvar time:", error);
            const msg = error.response?.data?.error || "Falha ao salvar time";
            Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = (player) => {
        if (members.find(m => m.id === player.id)) {
            Alert.alert('Aviso', 'Este jogador já está no time.');
            return;
        }
        setMembers([...members, player]);
        setInviteModalVisible(false); // Fecha modal principal ou volta? Vamos fechar tudo por enquanto.
        setInviteSource(null);
    };

    const handleGenerateLink = () => {
        Alert.alert('Link Gerado', 'O link de convite foi copiado para a área de transferência: https://playtime.app/invite/t/123xyz');
        setInviteModalVisible(false);
    };

    const removeMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const CustomInput = ({ label, value, onChangeText, placeholder, maxLength }) => (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <TextInput
                style={[styles.input, {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                maxLength={maxLength}
            />
        </View>
    );

    // Renderiza Item da Lista de Jogadores (para seleção)
    const renderPlayerSelectionItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.playerSelectionItem, { borderBottomColor: colors.border }]}
            onPress={() => handleInvite(item)}
        >
            <View style={styles.playerAvatarSmall}>
                {/* Mock Avatar */}
                <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.playerName, { color: colors.text }]}>{item.firstName} {item.surname}</Text>
                <Text style={[styles.playerNick, { color: colors.textSecondary }]}>{item.nickname}</Text>
            </View>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.primary }]}>
                    {mode === 'create' ? 'Criar Novo Time' : 'Editar Time'}
                </Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* LOGO UPLOAD */}
                <View style={styles.logoSection}>
                    <TouchableOpacity onPress={pickImage} style={[styles.logoPreview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {logo ? (
                            <Image source={{ uri: logo }} style={styles.logoImage} />
                        ) : (
                            <View style={styles.logoPlaceholder}>
                                <Ionicons name="camera" size={32} color={colors.textSecondary} />
                                <Text style={[styles.logoPlaceholderText, { color: colors.textSecondary }]}>Add Logo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* INFO BÁSICA */}
                <CustomInput label="Nome do Time" value={name} onChangeText={setName} placeholder="Ex: Leões FC" />
                <CustomInput label="Tag do Time (2-4 letras)" value={tag} onChangeText={text => setTag(text.toUpperCase())} placeholder="Ex: LEO" maxLength={4} />
                <CustomInput label="Cidade" value={city} onChangeText={setCity} placeholder="Ex: São Paulo" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <CustomInput label="Estado (UF)" value={state} onChangeText={setState} placeholder="Ex: SP" maxLength={2} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <CustomInput label="País" value={country} onChangeText={setCountry} placeholder="Ex: Brasil" />
                    </View>
                </View>

                {/* MEMBROS DO TIME */}
                <View style={styles.membersSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Membros ({members.length})</Text>

                    {members.map(member => (
                        <View key={member.id} style={[styles.memberCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.memberAvatar}>
                                <Text>👤</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={[styles.memberName, { color: colors.text }]}>{member.firstName} {member.surname}</Text>
                                <Text style={[styles.memberNick, { color: colors.textSecondary }]}>{member.nickname}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeMember(member.id)}>
                                <Ionicons name="trash-outline" size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.inviteButton, { borderColor: colors.primary }]}
                        onPress={() => {
                            setInviteSource(null); // Reseta para menu principal
                            setInviteModalVisible(true);
                        }}
                    >
                        <Ionicons name="person-add" size={20} color={colors.primary} />
                        <Text style={[styles.inviteButtonText, { color: colors.primary }]}>Convidar Jogador</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Salvar Time</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL DE CONVITE */}
            <Modal
                visible={inviteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setInviteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>

                        {/* HEADER DO MODAL */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {inviteSource === 'friends' ? 'Meus Amigos' :
                                    inviteSource === 'all' ? 'Todos os Jogadores' :
                                        'Convidar Jogador'}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                if (inviteSource) {
                                    setInviteSource(null); // Voltar pro menu
                                } else {
                                    setInviteModalVisible(false); // Fechar
                                }
                            }}>
                                <Ionicons name={inviteSource ? "arrow-back" : "close"} size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* MENU PRINCIPAL DE ESCOLHA */}
                        {!inviteSource && (
                            <View style={styles.inviteOptions}>
                                <TouchableOpacity style={styles.inviteOptionItem} onPress={() => setInviteSource('friends')}>
                                    <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                                        <Ionicons name="people" size={24} color="#4CAF50" />
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.text }]}>Meus Amigos</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.inviteOptionItem} onPress={() => setInviteSource('all')}>
                                    <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                                        <Ionicons name="earth" size={24} color="#2196F3" />
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.text }]}>Todos os Jogadores</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.inviteOptionItem} onPress={handleGenerateLink}>
                                    <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                                        <Ionicons name="link" size={24} color="#FF9800" />
                                    </View>
                                    <Text style={[styles.optionText, { color: colors.text }]}>Gerar Link de Convite</Text>
                                    <Ionicons name="copy-outline" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* LISTA DE SELEÇÃO (AMIGOS OU TODOS) */}
                        {inviteSource && (
                            <FlatList
                                data={inviteSource === 'friends' ? ranking.slice(0, 3) : ranking} // Mock: Amigos = Top 3
                                keyExtractor={item => item.id}
                                renderItem={renderPlayerSelectionItem}
                                contentContainerStyle={styles.selectionList}
                            />
                        )}

                    </View>
                </View>
            </Modal>

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
        paddingBottom: 60,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoPlaceholder: {
        alignItems: 'center',
    },
    logoPlaceholderText: {
        fontSize: 12,
        marginTop: 4,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 10,
    },
    membersSection: {
        marginTop: 10,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberName: {
        fontSize: 14,
        fontWeight: '600',
    },
    memberNick: {
        fontSize: 12,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 8,
    },
    inviteButtonText: {
        fontWeight: '600',
        marginLeft: 8,
    },
    saveButton: {
        marginTop: 32,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inviteOptions: {
        marginTop: 10,
    },
    inviteOptionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    // List Selection Styles
    selectionList: {
        paddingBottom: 40,
    },
    playerSelectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    playerAvatarSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    playerName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    playerNick: {
        fontSize: 12,
    },
});
