/**
 * 🔐 TELA DE LOGIN
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, enterAsGuest } = useAuth(); // Getting login from context

    const handleLogin = async () => {
        // Validação simples
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!email.includes('@')) {
            newErrors.email = 'Email inválido';
        }

        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            // Navegação é automática pois o AuthStack/AppStack observa o estado 'signed'
            console.log("Login Success");
        } else {
            alert(result.error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => enterAsGuest()}
            >
                <Ionicons name="close" size={28} color={colors.primary} />
            </TouchableOpacity>

            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo/Título */}
                <View style={styles.header}>
                    <Ionicons name="game-controller" size={64} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.primary }]}>
                        Bem-vindo de volta!
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.primary }]}>
                        Entre para continuar
                    </Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
                    <CustomInput
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({ ...errors, email: '' });
                        }}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        error={!!errors.email}
                        errorMessage={errors.email}
                    />

                    <CustomInput
                        label="Senha"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({ ...errors, password: '' });
                        }}
                        placeholder="••••••••"
                        secureTextEntry
                        error={!!errors.password}
                        errorMessage={errors.password}
                    />

                    {/* Lembrar-me e Esqueci senha */}
                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={styles.rememberMe}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        borderColor: colors.border,
                                        backgroundColor: rememberMe
                                            ? colors.primary
                                            : 'transparent',
                                    },
                                ]}
                            >
                                {rememberMe && (
                                    <Ionicons name="checkmark" size={14} color="#FFF" />
                                )}
                            </View>
                            <Text style={[styles.rememberText, { color: colors.primary }]}>
                                Lembrar-me
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={[styles.forgotText, { color: colors.primary }]}>
                                Esqueci a senha
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Login */}
                    <CustomButton
                        title="Entrar"
                        onPress={handleLogin}
                        style={styles.loginButton}
                    />

                    {/* Link para cadastro */}
                    <View style={styles.signupRow}>
                        <Text style={[styles.signupText, { color: colors.primary }]}>
                            Não tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={[styles.signupLink, { color: colors.primary }]}>
                                Cadastre-se
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingTop: 140, // Aumentado para descer mais o conteúdo
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 24,
        zIndex: 1,
        padding: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMe: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkmark: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    rememberText: {
        fontSize: 14,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        marginBottom: 24,
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});
