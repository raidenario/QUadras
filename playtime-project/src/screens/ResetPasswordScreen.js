/**
 * 🔄 TELA DE REDEFINIR SENHA
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function ResetPasswordScreen({ navigation }) {
    const { colors } = useTheme();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Validações de senha
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasNumber: false,
        passwordsMatch: false,
    });

    useEffect(() => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            passwordsMatch: password === confirmPassword && password.length > 0,
        });
    }, [password, confirmPassword]);

    const handleResetPassword = () => {
        const newErrors = {};

        if (!password) newErrors.password = 'Senha é obrigatória';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirme a senha';

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

        console.log('Senha redefinida!');
        alert('Senha redefinida com sucesso!');
        navigation.navigate('Login');
    };

    const ValidationItem = ({ isValid, text }) => (
        <View style={styles.validationItem}>
            <Ionicons
                name={isValid ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={isValid ? colors.primary : colors.textSecondary}
            />
            <Text
                style={[
                    styles.validationText,
                    { color: isValid ? colors.primary : colors.textSecondary },
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
            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.icon}>🔑</Text>
                    <Text style={[styles.title, { color: colors.primary }]}>
                        Redefinir Senha
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.primary }]}>
                        Crie uma nova senha segura
                    </Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
                    <CustomInput
                        label="Nova Senha"
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
                        label="Confirmar Nova Senha"
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

                    <CustomButton
                        title="Redefinir Senha"
                        onPress={handleResetPassword}
                        style={styles.resetButton}
                    />
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
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
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
    resetButton: {
        marginTop: 8,
    },
});
