/**
 * 🧭 NAVEGADOR PRINCIPAL
 * 
 * Configura a navegação por abas (Tab Navigation) do app.
 * As abas aparecem no footer (parte de baixo da tela).
 * 
 * CONCEITO: React Navigation é a biblioteca padrão para navegação
 * em React Native. Ela gerencia as telas e transições entre elas.
 */

import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Importa as telas principais
import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/GamesScreen';
import TeamsScreen from '../screens/TeamsScreen';
import CourtsScreen from '../screens/CourtsScreen';
import RankingScreen from '../screens/RankingScreen';

// Importa as telas de autenticação
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyRankingScreen from '../screens/MyRankingScreen';
import MyTeamsScreen from '../screens/MyTeamsScreen';
import TeamEditorScreen from '../screens/TeamEditorScreen';

// Importa o Header
import Header from '../components/Header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de Abas (principal)
function TabNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Início':
                            iconName = focused ? 'football' : 'football-outline';
                            break;
                        case 'Jogos':
                            iconName = focused ? 'calendar' : 'calendar-outline';
                            break;
                        case 'Times':
                            iconName = focused ? 'shield' : 'shield-outline';
                            break;
                        case 'Quadras':
                            iconName = focused ? 'location' : 'location-outline';
                            break;
                        case 'Ranking':
                            iconName = focused ? 'trophy' : 'trophy-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.tabBarInactive,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                    paddingHorizontal: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Jogos" component={GamesScreen} />
            <Tab.Screen name="Times" component={TeamsScreen} />
            <Tab.Screen name="Quadras" component={CourtsScreen} />
            <Tab.Screen name="Ranking" component={RankingScreen} />
        </Tab.Navigator>
    );
}

// Importa o hook de autenticação
import { useAuth } from '../context/AuthContext';

// Navegador de Autenticação (Login/Registro)
function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: 'modal',
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
    );
}

// Navegador Principal (App logado)
function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
                {() => (
                    <>
                        <Header onNotificationPress={() => console.log('Notificações')} />
                        <TabNavigator />
                    </>
                )}
            </Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MyRanking" component={MyRankingScreen} />
            <Stack.Screen name="MyTeams" component={MyTeamsScreen} />
            <Stack.Screen name="TeamEditor" component={TeamEditorScreen} />
        </Stack.Navigator>
    );
}

// Navegador Raiz que decide qual pilha mostrar
export default function AppNavigator() {
    const { signed, loading, isGuest } = useAuth();

    if (loading) {
        return null; // Ou um LoadingScreen
    }

    return (
        <NavigationContainer>
            {signed || isGuest ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}

/**
 * CONCEITOS:
 * 
 * 1. NavigationContainer: Container principal que envolve toda a navegação
 * 
 * 2. createBottomTabNavigator: Cria um navegador de abas na parte inferior
 * 
 * 3. Tab.Navigator: Componente que gerencia as abas
 *    - screenOptions: Configurações aplicadas a todas as telas
 * 
 * 4. Tab.Screen: Define uma tela/aba
 *    - name: Nome da aba (aparece no footer)
 *    - component: Componente da tela
 * 
 * 5. tabBarIcon: Função que retorna o ícone da aba
 *    - focused: true se a aba está ativa
 *    - color: cor automática baseada em focused
 *    - size: tamanho do ícone
 * 
 * 6. Platform.OS: Detecta se é iOS ou Android
 *    - Usado para ajustar estilos específicos de cada plataforma
 * 
 * FLUXO:
 * 
 * App.js
 *   └─ ThemeProvider (fornece o tema)
 *       └─ AppNavigator (gerencia navegação)
 *           └─ Tab.Navigator (abas do footer)
 *               ├─ HomeScreen
 *               ├─ GamesScreen
 *               ├─ TeamsScreen
 *               ├─ NotificationsScreen
 *               └─ ProfileScreen
 */
