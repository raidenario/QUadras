/**
 * 🌐 NAVEGADOR RAIZ
 * 
 * Gerencia a navegação entre autenticação e app principal.
 * Se o usuário não estiver logado, mostra telas de auth.
 * Se estiver logado, mostra o app principal.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { currentUser } from '../data/mockData';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
    // Verifica se o usuário está logado
    const isLoggedIn = currentUser.isLoggedIn;

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: 'modal', // Animação de modal
                }}
            >
                {isLoggedIn ? (
                    // Usuário logado - mostra o app principal
                    <Stack.Screen name="Main" component={AppNavigator} />
                ) : (
                    // Usuário não logado - mostra telas de autenticação
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
