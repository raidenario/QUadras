/**
 * 🔍 BARRA DE BUSCA
 * 
 * Componente de busca para filtrar jogos, times e quadras.
 * 
 * CONCEITO: TextInput é como <input> do HTML, mas para React Native.
 * Usamos useState para controlar o texto digitado.
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

/**
 * PROPS:
 * @param {string} placeholder - Texto de exemplo no campo
 * @param {function} onSearch - Função chamada ao digitar
 * @param {function} onFilterPress - Função ao clicar no filtro
 */
export default function SearchBar({
    placeholder = 'Buscar jogos, times ou quadras...',
    onSearch,
    onFilterPress,
}) {
    const { colors } = useTheme();

    // Estado para armazenar o texto digitado
    const [searchText, setSearchText] = useState('');

    /**
     * Chamada quando o usuário digita
     */
    const handleChangeText = (text) => {
        setSearchText(text);

        // Se foi passada uma função onSearch, chama ela
        if (onSearch) {
            onSearch(text);
        }
    };

    /**
     * Limpa o texto da busca
     */
    const handleClear = () => {
        setSearchText('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Ícone de busca */}
            <Ionicons
                name="search-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
            />

            {/* Campo de texto */}
            <TextInput
                style={[
                    styles.input,
                    {
                        color: colors.text,
                        // placeholderTextColor é definido abaixo
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={searchText}
                onChangeText={handleChangeText}
                returnKeyType="search" // Botão "buscar" no teclado
                autoCapitalize="none"   // Não capitaliza automaticamente
                autoCorrect={false}     // Desabilita autocorreção
            />

            {/* Botão de limpar (só aparece se tiver texto) */}
            {searchText.length > 0 && (
                <TouchableOpacity
                    onPress={handleClear}
                    style={styles.clearButton}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            )}

            {/* Ícone de filtro */}
            <TouchableOpacity
                onPress={onFilterPress}
                style={styles.filterButton}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="options-outline"
                    size={20}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        // Sombra
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    searchIcon: {
        marginRight: 8,
    },

    input: {
        flex: 1, // Ocupa todo o espaço disponível
        fontSize: 16,
        paddingVertical: 8,
    },

    clearButton: {
        padding: 4,
        marginRight: 8,
    },

    filterButton: {
        padding: 4,
    },
});

/**
 * COMO USAR:
 * 
 * import SearchBar from './components/SearchBar';
 * 
 * function MinhaScreen() {
 *   const handleSearch = (text) => {
 *     console.log('Buscando:', text);
 *     // Aqui você filtraria os dados
 *   };
 *   
 *   const handleFilter = () => {
 *     console.log('Abrir filtros');
 *     // Aqui você abriria um modal de filtros
 *   };
 *   
 *   return (
 *     <SearchBar
 *       onSearch={handleSearch}
 *       onFilterPress={handleFilter}
 *     />
 *   );
 * }
 * 
 * CONCEITOS:
 * 
 * 1. Conditional Rendering: {searchText.length > 0 && <Componente />}
 *    Só mostra o componente se a condição for verdadeira
 * 
 * 2. TextInput: Campo de entrada de texto
 *    - value: Valor atual
 *    - onChangeText: Função chamada ao digitar
 *    - placeholder: Texto de exemplo
 * 
 * 3. flex: 1 - Faz o elemento ocupar todo espaço disponível
 */
