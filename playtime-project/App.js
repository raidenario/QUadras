/**
 * 🏠 APP.JS - ARQUIVO PRINCIPAL
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Importa o ThemeProvider e AppNavigator
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * COMPONENTE INTERNO
 */
function AppContent() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppNavigator />
        </View>
    );
}

/**
 * COMPONENTE PRINCIPAL
 */
export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
