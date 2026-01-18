/**
 * 🔑 TELA DE ESQUECI A SENHA
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
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function ForgotPasswordScreen({ navigation }) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const handleSendLink = () => {
        if (!email) {
            setError('Email é obrigatório');
            return;
        }
        if (!email.includes('@')) {
            setError('Email inválido');
            return;
        }

        // Simula envio
        console.log('Enviar link para:', email);
        setSent(true);
    };

    if (sent) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.successContainer}>
                    <Ionicons name="checkmark-circle" size={80} color={colors.success} />
                    <Text style={[styles.successTitle, { color: colors.text }]}>
                        Email Enviado!
                    </Text>
                    <Text style={[styles.successText, { color: colors.textSecondary }]}>
                        Enviamos um link de redefinição de senha para{'\n'}
                        <Text style={{ fontWeight: '600' }}>{email}</Text>
                    </Text>
                    <Text style={[styles.successSubtext, { color: colors.textSecondary }]}>
                        Verifique sua caixa de entrada e spam
                    </Text>

                    <CustomButton
                        title="Voltar para Login"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.backButton}
                    />
                </View>
            </View>
        );
    }

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
                {/* Botão Voltar */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="help-circle" size={64} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.primary }]}>
                        Esqueceu a senha?
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.primary }]}>
                        Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
                    </Text>
                </View>

                {/* Formulário */}
                <View style={styles.form}>
                    <CustomInput
                        label="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError('');
                        }}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        error={!!error}
                        errorMessage={error}
                    />

                    <CustomButton
                        title="Enviar Link"
                        onPress={handleSendLink}
                        style={styles.sendButton}
                    />

                    {/* Link para voltar */}
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[styles.loginText, { color: colors.primary }]}>
                            Lembrou a senha?{' '}
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                Entrar
                            </Text>
                        </Text>
                    </TouchableOpacity>
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
    backButton: {
        marginBottom: 24,
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
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    sendButton: {
        marginBottom: 24,
    },
    loginLink: {
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 16,
    },
    successText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    successSubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 40,
    },
});
