/**
 * 📝 TELA DE CADASTRO
 */

import React, { useState, useEffect } from 'react';
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

export default function RegisterScreen({ navigation }) {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Validações de senha
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasNumber: false,
        passwordsMatch: false,
    });

    // Atualiza validações quando senha muda
    useEffect(() => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            passwordsMatch: password === confirmPassword && password.length > 0,
        });
    }, [password, confirmPassword]);

    const { register } = useAuth();

    const handleRegister = async () => {
        const newErrors = {};

        if (!name) newErrors.name = 'Nome é obrigatório';
        if (!email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!email.includes('@')) {
            newErrors.email = 'Email inválido';
        }
        if (!password) newErrors.password = 'Senha é obrigatória';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirme a senha';

        // Valida regras de senha
        if (!passwordValidation.minLength) {
            newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        }
        if (!passwordValidation.hasNumber) {
            newErrors.password = 'Senha deve conter pelo menos um número';
        }
        if (!passwordValidation.passwordsMatch) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await register({ name, email, password });

        if (result.success) {
            console.log("Register Success");
            // Auth stack handles navigation
        } else {
            alert(result.error);
        }
    };

    const ValidationItem = ({ isValid, text }) => (
        <View style={styles.validationItem}>
            <Ionicons
                name={isValid ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={colors.primary}
            />
            <Text
                style={[
                    styles.validationText,
                    {
                        color: colors.primary,
                        fontWeight: isValid ? '600' : '400',
                    },
                ]}
            >
                {text}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={28} color={colors.primary} />
            </TouchableOpacity>

            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="person-add" size={64} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.primary }]}>
                        Criar Conta
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.primary }]}>
                        Preencha os dados para começar
                    </Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
                    <CustomInput
                        label="Nome Completo"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors({ ...errors, name: '' });
                        }}
                        placeholder="João Silva"
                        error={!!errors.name}
                        errorMessage={errors.name}
                    />

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

                    {/* Validações de senha */}
                    {password.length > 0 && (
                        <View style={styles.validationContainer}>
                            <ValidationItem
                                isValid={passwordValidation.minLength}
                                text="Mínimo de 8 caracteres"
                            />
                            <ValidationItem
                                isValid={passwordValidation.hasNumber}
                                text="Pelo menos um número"
                            />
                        </View>
                    )}

                    <CustomInput
                        label="Confirmar Senha"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setErrors({ ...errors, confirmPassword: '' });
                        }}
                        placeholder="••••••••"
                        secureTextEntry
                        error={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword}
                    />

                    {/* Validação de senhas coincidentes */}
                    {confirmPassword.length > 0 && (
                        <View style={styles.validationContainer}>
                            <ValidationItem
                                isValid={passwordValidation.passwordsMatch}
                                text="As senhas coincidem"
                            />
                        </View>
                    )}

                    {/* Botão de Cadastro */}
                    <CustomButton
                        title="Cadastrar"
                        onPress={handleRegister}
                        style={styles.registerButton}
                    />

                    {/* Link para login */}
                    <View style={styles.loginRow}>
                        <Text style={[styles.loginText, { color: colors.primary }]}>
                            Já tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginLink, { color: colors.primary }]}>
                                Entrar
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
        paddingTop: 100, // Mais espaço no topo
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
    },
    form: {
        width: '100%',
    },
    validationContainer: {
        marginBottom: 16,
        marginTop: -8,
    },
    validationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    validationText: {
        fontSize: 12,
        marginLeft: 8,
    },
    registerButton: {
        marginTop: 8,
        marginBottom: 24,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});
