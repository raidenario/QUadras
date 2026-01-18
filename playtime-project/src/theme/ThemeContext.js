/**
 * 🌓 GERENCIADOR DE TEMA (LIGHT/DARK MODE)
 * 
 * Este arquivo usa a Context API do React para compartilhar o tema
 * entre TODOS os componentes do app, sem precisar passar props.
 * 
 * CONCEITO DE CONTEXT:
 * Imagine que o tema é uma "variável global" que qualquer componente
 * pode acessar. Quando você muda o tema aqui, TODOS os componentes
 * que usam esse tema são atualizados automaticamente!
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';

/**
 * 1. CRIAR O CONTEXT
 * Isso cria um "container" para guardar os dados do tema
 */
const ThemeContext = createContext();

/**
 * 2. PROVIDER (PROVEDOR)
 * Este componente "envolve" o app inteiro e fornece o tema para todos
 * 
 * @param {Object} children - Componentes filhos (todo o app)
 */
export function ThemeProvider({ children }) {
    // useColorScheme() detecta se o celular está em modo escuro
    /**
     * Estado do tema
     * - 'light': Modo claro (padrão)
     * - 'dark': Modo escuro
     */
    const [themeMode, setThemeMode] = useState('light');

    /**
     * Calcula qual tema usar
     */
    const isDark = themeMode === 'dark';

    /**
     * Pega as cores corretas baseado no tema
     */
    const colors = isDark ? darkColors : lightColors;

    /**
     * Função para alternar entre light e dark
     */
    const toggleTheme = () => {
        setThemeMode((current) => current === 'light' ? 'dark' : 'light');
    };

    /**
     * Função para definir um tema específico
     */
    const setTheme = (mode) => {
        if (['light', 'dark', 'auto'].includes(mode)) {
            setThemeMode(mode);
        }
    };

    /**
     * Valor que será compartilhado com todos os componentes
     */
    const value = {
        colors,           // Paleta de cores atual
        isDark,           // true se está em modo escuro
        themeMode,        // 'light', 'dark' ou 'auto'
        toggleTheme,      // Função para alternar tema
        setTheme,         // Função para definir tema específico
    };

    /**
     * Provider envolve os children e fornece o value
     */
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * 3. HOOK CUSTOMIZADO
 * Facilita o uso do tema em qualquer componente
 * 
 * COMO USAR:
 * 
 * import { useTheme } from './theme/ThemeContext';
 * 
 * function MeuComponente() {
 *   const { colors, isDark, toggleTheme } = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: colors.background }}>
 *       <Text style={{ color: colors.text }}>
 *         Modo: {isDark ? 'Escuro' : 'Claro'}
 *       </Text>
 *       <Button onPress={toggleTheme} title="Trocar Tema" />
 *     </View>
 *   );
 * }
 */
export function useTheme() {
    const context = useContext(ThemeContext);

    // Verifica se o componente está dentro do ThemeProvider
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    }

    return context;
}

/**
 * RESUMO:
 * 
 * 1. ThemeProvider envolve o app (no App.js)
 * 2. Qualquer componente usa useTheme() para acessar cores e funções
 * 3. Quando toggleTheme() é chamado, TODOS os componentes atualizam
 * 
 * É como mágica! 🪄
 */
