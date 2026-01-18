/**
 * 🎨 PALETA DE CORES DO APP
 * 
 * Este arquivo define todas as cores usadas no app.
 * Temos duas versões: Light (claro) e Dark (escuro)
 * 
 * CONCEITO: Ao invés de escrever cores direto no código (ex: '#1E3A5F'),
 * centralizamos aqui. Assim, se quiser mudar uma cor, muda só aqui!
 */

export const lightColors = {
    // Cores principais
    primary: '#1E3A5F',        // Azul escuro (header, cards destacados)
    secondary: '#4CAF50',      // Verde (botões de ação)
    accent: '#FF9800',         // Laranja (destaques)

    // Fundos
    background: '#F5F5F5',     // Cinza claro (fundo geral)
    surface: '#FFFFFF',        // Branco (cards, modais)
    header: '#1E3A5F',         // Azul escuro (cabeçalho)

    // Textos
    text: '#1E3A5F',           // Preto (texto principal)
    textSecondary: '#757575',  // Cinza (texto secundário)
    textOnPrimary: '#FFFFFF',  // Branco (texto em fundo azul)

    // Bordas e divisores
    border: '#E0E0E0',         // Cinza claro
    divider: '#BDBDBD',        // Cinza médio

    // Estados
    success: '#4CAF50',        // Verde (sucesso)
    error: '#F44336',          // Vermelho (erro)
    warning: '#FF9800',        // Laranja (aviso)
    info: '#2196F3',           // Azul (informação)

    // Específicos
    tabBarActive: '#4CAF50',   // Verde (aba ativa)
    tabBarInactive: '#9E9E9E', // Cinza (aba inativa)
};

export const darkColors = {
    // Cores principais
    primary: '#2d60a3ff',        // Azul claro dos cards (usado em header e botões)
    secondary: '#66BB6A',      // Verde mais claro
    accent: '#FFB74D',         // Laranja mais claro

    // Fundos
    background: '#121212',     // Preto (fundo geral)
    surface: '#1E1E1E',        // Cinza escuro (cards, modais)
    header: '#2d60a3ff',         // Azul claro (mesmo dos cards)

    // Textos
    text: '#FFFFFF',           // Branco (texto principal)
    textSecondary: '#B0B0B0',  // Cinza claro (texto secundário)
    textOnPrimary: '#FFFFFF',  // Branco (texto em fundo azul)

    // Bordas e divisores
    border: '#2C2C2C',         // Cinza escuro
    divider: '#3C3C3C',        // Cinza médio escuro

    // Estados
    success: '#66BB6A',        // Verde claro
    error: '#EF5350',          // Vermelho claro
    warning: '#FFB74D',        // Laranja claro
    info: '#2d60a3ff',           // Azul claro

    // Específicos
    tabBarActive: '#2d60a3ff',   // Azul claro (aba ativa)
    tabBarInactive: '#757575', // Cinza (aba inativa)
};

/**
 * COMO USAR:
 * 
 * import { lightColors, darkColors } from './colors';
 * 
 * // Pegar a cor baseado no tema atual
 * const colors = isDark ? darkColors : lightColors;
 * 
 * // Usar no estilo
 * backgroundColor: colors.primary
 */
