/**
 * 📝 INPUT CUSTOMIZADO
 * 
 * Componente de input reutilizável com label e validação visual.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

/**
 * PROPS:
 * @param {string} label - Texto do label
 * @param {string} value - Valor do input
 * @param {function} onChangeText - Função ao mudar texto
 * @param {string} placeholder - Placeholder
 * @param {boolean} secureTextEntry - Se é campo de senha
 * @param {string} keyboardType - Tipo de teclado ('email-address', 'default', etc)
 * @param {boolean} error - Se tem erro
 * @param {string} errorMessage - Mensagem de erro
 * @param {object} style - Estilos adicionais
 */
export default function CustomInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    error = false,
    errorMessage = '',
    style,
}) {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {/* Label */}
            {label && (
                <Text style={[styles.label, { color: colors.primary }]}>
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error
                            ? colors.error
                            : isFocused
                                ? colors.primary
                                : colors.border,
                    },
                ]}
            >
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                    autoComplete="off"
                />

                {/* Botão de mostrar/esconder senha */}
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Mensagem de erro */}
            {error && errorMessage && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {errorMessage}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    eyeButton: {
        padding: 8,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
