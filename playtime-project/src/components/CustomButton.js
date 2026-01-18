/**
 * 🔘 BOTÃO CUSTOMIZADO
 * 
 * Componente reutilizável de botão com diferentes estilos.
 * 
 * CONCEITO: Ao invés de criar um botão do zero toda vez,
 * criamos um componente que pode ser usado em vários lugares
 * com diferentes textos, cores e ações.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * PROPS (Propriedades que o componente aceita):
 * 
 * @param {string} title - Texto do botão
 * @param {function} onPress - Função chamada ao clicar
 * @param {string} variant - Estilo: 'primary', 'secondary', 'outline'
 * @param {boolean} disabled - Se true, botão fica desabilitado
 * @param {boolean} loading - Se true, mostra loading
 * @param {object} style - Estilos adicionais
 */
export default function CustomButton({
    title,
    onPress,
    variant = 'primary', // Valor padrão
    disabled = false,
    loading = false,
    style,
}) {
    const { colors } = useTheme(); // Pega as cores do tema atual

    /**
     * Define o estilo baseado na variante
     */
    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: disabled ? colors.border : colors.primary,
                    borderWidth: 0,
                };
            case 'secondary':
                return {
                    backgroundColor: disabled ? colors.border : colors.secondary,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: disabled ? colors.border : colors.primary,
                };
            default:
                return {
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                };
        }
    };

    /**
     * Define a cor do texto baseado na variante
     */
    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        if (variant === 'outline') return colors.primary;
        return colors.textOnPrimary;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                style, // Permite estilos customizados
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7} // Opacidade ao pressionar (feedback visual)
        >
            {loading ? (
                // Mostra indicador de loading
                <ActivityIndicator color={getTextColor()} />
            ) : (
                // Mostra o texto
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

/**
 * ESTILOS
 * 
 * StyleSheet.create() é como CSS, mas em JavaScript.
 * Otimiza a performance do app.
 */
const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,      // Espaçamento vertical interno
        paddingHorizontal: 24,    // Espaçamento horizontal interno
        borderRadius: 8,          // Bordas arredondadas
        alignItems: 'center',     // Centraliza conteúdo horizontalmente
        justifyContent: 'center', // Centraliza conteúdo verticalmente
        minWidth: 120,            // Largura mínima
    },
    text: {
        fontSize: 16,
        fontWeight: '600',        // Negrito (100-900)
        textTransform: 'uppercase', // MAIÚSCULAS
    },
});

/**
 * COMO USAR:
 * 
 * import CustomButton from './components/CustomButton';
 * 
 * // Botão primário (verde)
 * <CustomButton 
 *   title="Agendar" 
 *   onPress={() => alert('Clicou!')}
 * />
 * 
 * // Botão outline (transparente com borda)
 * <CustomButton 
 *   title="Criar Time" 
 *   variant="outline"
 *   onPress={() => console.log('Criar time')}
 * />
 * 
 * // Botão desabilitado
 * <CustomButton 
 *   title="Indisponível" 
 *   disabled={true}
 * />
 * 
 * // Botão com loading
 * <CustomButton 
 *   title="Salvando..." 
 *   loading={true}
 * />
 */
